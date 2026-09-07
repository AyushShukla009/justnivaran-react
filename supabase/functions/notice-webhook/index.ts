import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-hub-signature-256, x-webhook-secret",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
};

// Helper: HMAC SHA-256 Signature Verification for Webhooks
async function verifyHmacSignature(secret: string, payload: string, headerSig: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
    const signatureBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    const expectedSig = "sha256=" + Array.from(new Uint8Array(signatureBytes)).map(b => b.toString(16).padStart(2, "0")).join("");
    return expectedSig.toLowerCase() === headerSig.toLowerCase();
  } catch (_) {
    return false;
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // 1. Verification challenge handling for WhatsApp / Webhook handshake (GET)
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    const verifySecret = Deno.env.get("NOTICE_WEBHOOK_VERIFY_TOKEN") || Deno.env.get("NOTICE_WEBHOOK_SECRET") || "jn_notice_verify_2026";
    if (mode === "subscribe" && token === verifySecret) {
      return new Response(challenge || "ok", { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const webhookSecret = Deno.env.get("NOTICE_WEBHOOK_SECRET") || Deno.env.get("WEBHOOK_SECRET") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ success: false, error: "CONFIG_ERROR", message: "Missing service credentials." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const rawBody = await req.text();
    let body: any = {};
    try {
      body = JSON.parse(rawBody);
    } catch (_) {
      return new Response(JSON.stringify({ success: false, error: "INVALID_JSON", message: "Malformed JSON payload." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 2. Webhook Authentication & Signature Validation (POST)
    if (webhookSecret) {
      const headerSecret = req.headers.get("x-webhook-secret");
      const authHeader = req.headers.get("authorization");
      const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7).trim() : null;
      const hubSig = req.headers.get("x-hub-signature-256");

      let isAuthenticated = false;

      // Direct Shared Secret Match
      if (headerSecret && headerSecret === webhookSecret) {
        isAuthenticated = true;
      } else if (bearerToken && (bearerToken === webhookSecret || bearerToken === supabaseServiceKey)) {
        isAuthenticated = true;
      } else if (hubSig && await verifyHmacSignature(webhookSecret, rawBody, hubSig)) {
        isAuthenticated = true;
      }

      if (!isAuthenticated) {
        return new Response(JSON.stringify({
          success: false,
          error: "UNAUTHORIZED_WEBHOOK",
          message: "Unauthorized carrier delivery webhook: Missing or invalid signature/secret."
        }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Provider Webhook Processing (WhatsApp Cloud API / Generic Carrier Webhook Payload)
    let msgId: string | null = null;
    let deliveryStatus: string | null = null;
    let docketNumber: string | null = null;
    let errorDetails: string | null = null;

    // A. WhatsApp Cloud API Webhook Format
    if (body.entry && body.entry[0]?.changes && body.entry[0]?.changes[0]?.value?.statuses) {
      const statusObj = body.entry[0].changes[0].value.statuses[0];
      msgId = statusObj.id;
      const rawStatus = statusObj.status; // 'sent', 'delivered', 'read', 'failed'
      
      if (rawStatus === "delivered") deliveryStatus = "Delivered";
      else if (rawStatus === "sent") deliveryStatus = "Sent";
      else if (rawStatus === "read") deliveryStatus = "Read";
      else if (rawStatus === "failed") {
        deliveryStatus = "Failed";
        errorDetails = JSON.stringify(statusObj.errors || "Provider delivery failed");
      }
    } 
    // B. Standard Institutional Carrier Webhook Format
    else {
      msgId = body.msg_id || body.provider_msg_id;
      docketNumber = body.docket_number;
      const rawStatus = String(body.status || "").toLowerCase();

      if (rawStatus === "delivered") deliveryStatus = "Delivered";
      else if (rawStatus === "sent" || rawStatus === "accepted") deliveryStatus = "Sent";
      else if (rawStatus === "failed" || rawStatus === "undelivered" || rawStatus === "bounced") {
        deliveryStatus = "Failed";
        errorDetails = body.error || "Delivery rejected by destination carrier";
      }
    }

    if (!deliveryStatus) {
      return new Response(JSON.stringify({ status: "ignored", message: "No actionable delivery status." }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 3. Update notice_deliveries table and fetch delivery record
    const updateData: any = {
      status: deliveryStatus,
      delivered_at: deliveryStatus === "Delivered" ? new Date().toISOString() : null,
      error_details: errorDetails
    };

    let updatedDelivery: any = null;

    if (msgId) {
      const { data } = await supabase
        .from("notice_deliveries")
        .update(updateData)
        .eq("provider_msg_id", msgId)
        .select("id, dispute_id, docket_number, recipient_type, recipient_contact, metadata")
        .maybeSingle();
      updatedDelivery = data;
    } else if (docketNumber) {
      const { data } = await supabase
        .from("notice_deliveries")
        .update(updateData)
        .eq("docket_number", docketNumber)
        .eq("recipient_type", "respondent")
        .select("id, dispute_id, docket_number, recipient_type, recipient_contact, metadata")
        .maybeSingle();
      updatedDelivery = data;
    }

    const effectiveDocket = updatedDelivery?.docket_number || docketNumber;
    const effectiveDisputeId = updatedDelivery?.dispute_id;
    const isRecoveryEvent = updatedDelivery?.metadata && (updatedDelivery.metadata.event === "PIN_RECOVERY" || updatedDelivery.metadata.type === "PIN_RECOVERY");

    // 4. On Verified Delivery Receipt: Guarded Recovery Status Transition & Tamper-Proof Audit Event
    if (deliveryStatus === "Delivered" && effectiveDocket) {
      // STRICT ISOLATION GUARD: Only transition dispute recovery status if notice was explicitly a PIN_RECOVERY notice
      if (effectiveDisputeId && isRecoveryEvent) {
        await supabase
          .from("disputes")
          .update({
            pin_recovery_status: "RECOVERED",
            requires_pin_reset: false
          })
          .eq("id", effectiveDisputeId);
      }

      await supabase.from("case_audit_logs").insert([
        {
          case_id: effectiveDisputeId || null,
          docket_number: effectiveDocket,
          event_type: "NOTICE_DELIVERED",
          actor_type: "webhook_receipt",
          change_summary: isRecoveryEvent
            ? `Statutory PIN recovery credential notice confirmed delivered to carrier receipt for ${updatedDelivery?.recipient_contact || "recipient"}. Case recovery confirmed.`
            : `Statutory dispute notice confirmed delivered to destination carrier receipt (Provider ID: ${msgId || "webhook_event"}).`,
          metadata: {
            provider_msg_id: msgId,
            status: deliveryStatus,
            recipient_type: updatedDelivery?.recipient_type,
            event_type: isRecoveryEvent ? "PIN_RECOVERY" : "STATUTORY_NOTICE"
          }
        }
      ]);
    }

    return new Response(JSON.stringify({
      success: true,
      status: deliveryStatus,
      is_recovery_event: Boolean(isRecoveryEvent),
      recovered: Boolean(deliveryStatus === "Delivered" && isRecoveryEvent)
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
