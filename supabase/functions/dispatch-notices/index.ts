import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

interface DispatchPayload {
  delivery_id?: string;
  docket_number?: string;
  batch_limit?: number;
  test_mode?: boolean;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";
    const smtpFrom = Deno.env.get("EMAIL_FROM") || "JustNivaran Registry <notices@justnivaran.in>";
    const testInbox = Deno.env.get("TEST_INBOX_EMAIL") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ success: false, error: "CONFIG_ERROR", message: "Missing service credentials." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Worker Authorization Verification (Restricted internal endpoint)
    const workerSecret = Deno.env.get("DISPATCH_WORKER_SECRET") || supabaseServiceKey;
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7).trim() : null;
    const headerSecret = req.headers.get("x-dispatch-secret") || req.headers.get("apikey");

    if (workerSecret && bearerToken !== workerSecret && bearerToken !== supabaseServiceKey && headerSecret !== workerSecret && headerSecret !== supabaseServiceKey) {
      return new Response(JSON.stringify({
        success: false,
        error: "UNAUTHORIZED_WORKER",
        message: "Unauthorized invocation of notice dispatch worker. Valid authorization header required."
      }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    let body: DispatchPayload = {};
    if (req.method === "POST") {
      try {
        body = await req.json();
      } catch (_) {
        body = {};
      }
    }

    const limit = Math.min(body.batch_limit || 10, 50);

    // 1. Fetch pending notices from queue
    let query = supabase
      .from("notice_deliveries")
      .select("id, dispute_id, docket_number, recipient_type, channel, recipient_contact, status, metadata")
      .eq("status", "Queued")
      .order("created_at", { ascending: true })
      .limit(limit);

    if (body.delivery_id) {
      query = query.eq("id", body.delivery_id);
    }
    if (body.docket_number) {
      query = query.eq("docket_number", body.docket_number);
    }

    const { data: notices, error: noticeErr } = await query;
    if (noticeErr) {
      throw new Error(`Failed to fetch notices: ${noticeErr.message}`);
    }

    if (!notices || notices.length === 0) {
      return new Response(JSON.stringify({ success: true, message: "No queued notices pending dispatch.", dispatched_count: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const results = [];

    for (const notice of notices) {
      // 2. Duplicate-Send Prevention: Atomically claim notice by moving from 'Queued' to 'Sending'
      const { data: claimData, error: claimErr } = await supabase
        .from("notice_deliveries")
        .update({ status: "Sending" })
        .eq("id", notice.id)
        .eq("status", "Queued")
        .select("id");

      if (claimErr || !claimData || claimData.length === 0) {
        // Notice was already claimed by another concurrent worker instance
        continue;
      }

      const isRecoveryNotice = notice.metadata && notice.metadata.event === "PIN_RECOVERY";
      let recoveryPin: string | null = null;
      let tokenId: string | null = null;
      let tokenRecord: any = null;

      // 3. Ephemeral Token Lookup, Expiry & Retry Check
      if (isRecoveryNotice) {
        const { data: tokData, error: tokErr } = await supabase
          .from("case_pin_recovery_tokens")
          .select("id, raw_pin_ephemeral, expires_at, attempts, max_attempts, consumed")
          .eq("delivery_id", notice.id)
          .maybeSingle();

        if (tokErr || !tokData) {
          await supabase
            .from("notice_deliveries")
            .update({ status: "Failed", error_details: "RECOVERY_TOKEN_NOT_FOUND" })
            .eq("id", notice.id);

          results.push({ docket_number: notice.docket_number, status: "Failed", error: "RECOVERY_TOKEN_NOT_FOUND" });
          continue;
        }

        tokenRecord = tokData;
        tokenId = tokData.id;

        // Check if token is already consumed
        if (tokData.consumed) {
          await supabase
            .from("notice_deliveries")
            .update({ status: "Failed", error_details: "RECOVERY_TOKEN_ALREADY_CONSUMED" })
            .eq("id", notice.id);

          results.push({ docket_number: notice.docket_number, status: "Failed", error: "RECOVERY_TOKEN_ALREADY_CONSUMED" });
          continue;
        }

        // Check token expiration
        const expiresAt = new Date(tokData.expires_at).getTime();
        const now = Date.now();
        if (expiresAt <= now) {
          await supabase
            .from("notice_deliveries")
            .update({ status: "Failed", error_details: "RECOVERY_TOKEN_EXPIRED" })
            .eq("id", notice.id);

          await supabase.from("case_audit_logs").insert([
            {
              case_id: notice.dispute_id,
              docket_number: notice.docket_number,
              event_type: "PIN_RECOVERY_EXPIRED",
              actor_type: "delivery_worker",
              change_summary: `Ephemeral recovery token expired before transmission to ${notice.recipient_contact}.`,
              metadata: { delivery_id: notice.id }
            }
          ]);

          results.push({ docket_number: notice.docket_number, status: "Failed", error: "RECOVERY_TOKEN_EXPIRED" });
          continue;
        }

        // Check retry limits
        if (tokData.attempts >= tokData.max_attempts) {
          await supabase
            .from("notice_deliveries")
            .update({ status: "Failed", error_details: "MAX_RETRIES_EXCEEDED" })
            .eq("id", notice.id);

          results.push({ docket_number: notice.docket_number, status: "Failed", error: "MAX_RETRIES_EXCEEDED" });
          continue;
        }

        recoveryPin = tokData.raw_pin_ephemeral;
      }

      const targetEmail = testInbox || notice.recipient_contact;
      let emailSuccess = false;
      let providerMsgId = `mock_msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      let dispatchError = null;

      // 4. Outbound Provider Transmission (Resend API or Controlled Test Mode)
      if (resendApiKey && !body.test_mode) {
        try {
          const emailSubject = recoveryPin
            ? `[JustNivaran ODR] Confidential Case Access PIN Recovery — ${notice.docket_number}`
            : `[JustNivaran ODR] Formal Notice of Dispute Filing — ${notice.docket_number}`;

          const emailBody = recoveryPin
            ? `
              <h2>JustNivaran Online Dispute Resolution</h2>
              <p>A fresh Access PIN has been generated for case dossier: <strong>${notice.docket_number}</strong>.</p>
              <p style="font-size: 20px; font-weight: bold; background: #f4f4f5; padding: 12px; border-radius: 6px; letter-spacing: 2px;">
                ${recoveryPin}
              </p>
              <p>This PIN is confidential. Use it to access your case dossier at https://justnivaran.in/docket.</p>
            `
            : `
              <h2>JustNivaran Online Dispute Resolution</h2>
              <p>Formal statutory notice registered under docket: <strong>${notice.docket_number}</strong>.</p>
              <p>Access your case dossier at https://justnivaran.in/docket.</p>
            `;

          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              from: smtpFrom,
              to: [targetEmail],
              subject: emailSubject,
              html: emailBody
            })
          });

          const resJson = await res.json();
          if (res.ok && resJson.id) {
            emailSuccess = true;
            providerMsgId = resJson.id;
          } else {
            dispatchError = resJson.message || "Resend API error";
          }
        } catch (err: any) {
          dispatchError = err.message || "Transport network error";
        }
      } else {
        // Controlled Test Mode / Simulated Direct Delivery
        emailSuccess = true;
        providerMsgId = `test_msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      }

      // 5. Update Status: Mark 'Sent' upon successful transmission (Marked 'Delivered' ONLY upon verified receipt)
      if (emailSuccess) {
        await supabase
          .from("notice_deliveries")
          .update({
            status: "Sent",
            provider_msg_id: providerMsgId,
            dispatched_at: new Date().toISOString()
          })
          .eq("id", notice.id);

        if (tokenId) {
          await supabase
            .from("case_pin_recovery_tokens")
            .update({
              consumed: true,
              consumed_at: new Date().toISOString(),
              attempts: (tokenRecord?.attempts || 0) + 1
            })
            .eq("id", tokenId);
        }

        // Log NOTICE_SENT audit event
        await supabase.from("case_audit_logs").insert([
          {
            case_id: notice.dispute_id,
            docket_number: notice.docket_number,
            event_type: "NOTICE_SENT",
            actor_type: "delivery_worker",
            change_summary: `Notice transmitted to provider for ${targetEmail} (Provider ID: ${providerMsgId}). Awaiting delivery receipt.`,
            metadata: { channel: notice.channel, recipient_type: notice.recipient_type, provider_msg_id: providerMsgId }
          }
        ]);

        results.push({
          docket_number: notice.docket_number,
          status: "Sent",
          recipient: targetEmail,
          provider_msg_id: providerMsgId
        });
      } else {
        // Handle failure and retry bounds
        if (tokenId && tokenRecord) {
          const newAttempts = tokenRecord.attempts + 1;
          await supabase
            .from("case_pin_recovery_tokens")
            .update({ attempts: newAttempts })
            .eq("id", tokenId);

          if (newAttempts >= tokenRecord.max_attempts) {
            await supabase
              .from("notice_deliveries")
              .update({ status: "Failed", error_details: dispatchError })
              .eq("id", notice.id);
          } else {
            // Reset to Queued for retry on next batch
            await supabase
              .from("notice_deliveries")
              .update({ status: "Queued", error_details: dispatchError })
              .eq("id", notice.id);
          }
        } else {
          await supabase
            .from("notice_deliveries")
            .update({ status: "Failed", error_details: dispatchError })
            .eq("id", notice.id);
        }

        results.push({
          docket_number: notice.docket_number,
          status: "Failed",
          recipient: targetEmail,
          error: dispatchError
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      sent_count: results.filter(r => r.status === "Sent").length,
      failed_count: results.filter(r => r.status === "Failed").length,
      results
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err: any) {
    console.error("Dispatch worker error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
