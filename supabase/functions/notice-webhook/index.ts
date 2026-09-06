import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-hub-signature-256",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Verification challenge handling for WhatsApp / Webhook handshake
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    const verifySecret = Deno.env.get("NOTICE_WEBHOOK_VERIFY_TOKEN") || "jn_notice_verify_2026";
    if (mode === "subscribe" && token === verifySecret) {
      return new Response(challenge || "ok", { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    const body = await req.json();

    // Provider Webhook Processing (WhatsApp Cloud API / Generic Webhook Payload)
    // Structure: { provider: 'whatsapp' | 'email' | 'sms', msg_id: '...', status: 'sent' | 'delivered' | 'failed', docket_number: '...' }
    let msgId: string | null = null;
    let deliveryStatus: string | null = null;
    let docketNumber: string | null = null;
    let errorDetails: string | null = null;

    // 1. WhatsApp Cloud API Webhook Format
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
    // 2. Standard Institutional Notice Webhook Format
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

    // 3. Update notice_deliveries table
    const updateData: any = {
      status: deliveryStatus,
      delivered_at: deliveryStatus === "Delivered" ? new Date().toISOString() : null,
      error_details: errorDetails
    };

    if (msgId) {
      await supabase
        .from("notice_deliveries")
        .update(updateData)
        .eq("provider_msg_id", msgId);
    } else if (docketNumber) {
      await supabase
        .from("notice_deliveries")
        .update(updateData)
        .eq("docket_number", docketNumber)
        .eq("recipient_type", "respondent");
    }

    // 4. Log provider delivery confirmation to case_audit_logs if delivered
    if (deliveryStatus === "Delivered" && docketNumber) {
      await supabase.from("case_audit_logs").insert([
        {
          docket_number: docketNumber,
          event_type: "NOTICE_DELIVERED",
          actor_type: "system",
          change_summary: `Statutory dispute notice confirmed delivered to respondent via provider webhook receipt.`,
          metadata: { provider_msg_id: msgId, status: deliveryStatus }
        }
      ]);
    }

    return new Response(JSON.stringify({ success: true, status: deliveryStatus }), {
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
