import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

// Simple SHA-256 helper for composite client+docket rate limiting
async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    // Service role client with elevated privileges to execute private queries securely
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || "127.0.0.1";

    const body = await req.json();
    const action = body.action || "status";
    const rawDocket = String(body.docket_number || "").trim().toUpperCase();

    if (!rawDocket) {
      return new Response(
        JSON.stringify({ success: false, error: "INVALID_DOCKET", message: "Case Docket number is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const clientHash = await hashString(`${clientIp}:${rawDocket}`);
    const maskedIp = clientIp.replace(/\.\d+$/, ".xxx");

    // Action 1: Public Masked Status Lookup
    if (action === "status") {
      const { data: dispute, error } = await supabase
        .from("disputes")
        .select("docket_number, mode, status, created_at, hearing_date, hearing_time")
        .ilike("docket_number", rawDocket)
        .maybeSingle();

      if (error || !dispute) {
        // Generic 404 response to avoid docket enumeration
        return new Response(
          JSON.stringify({ success: false, error: "NOT_FOUND", message: "Dispute record not located in registry." }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            docket_number: dispute.docket_number,
            mode: dispute.mode,
            status: dispute.status,
            created_at: dispute.created_at,
            hearing_date: dispute.hearing_date,
            hearing_time: dispute.hearing_time
          }
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Action 2: Rate-Limited Confidential PIN Verification
    if (action === "verify-pin") {
      const rawPin = String(body.pin || "").trim();

      if (!rawPin || rawPin.length < 4) {
        return new Response(
          JSON.stringify({ success: false, error: "INVALID_CREDENTIALS", message: "The docket number or access PIN provided is invalid." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Execute internal rate-limited verification RPC via Service Role
      const { data: rpcResult, error: rpcError } = await supabase.rpc(
        "internal_verify_docket_pin",
        {
          p_docket: rawDocket,
          p_pin: rawPin,
          p_client_hash: clientHash,
          p_ip_masked: maskedIp
        }
      );

      if (rpcError) {
        console.error("RPC Error:", rpcError);
        return new Response(
          JSON.stringify({ success: false, error: "VERIFICATION_ERROR", message: "Authentication service temporarily unavailable." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!rpcResult || !rpcResult.success) {
        const statusCode = rpcResult?.error === "RATE_LIMITED" ? 429 : 401;
        return new Response(
          JSON.stringify(rpcResult || { success: false, error: "INVALID_CREDENTIALS", message: "The docket number or access PIN provided is invalid." }),
          { status: statusCode, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Successful Authentication: Generate short-lived signed URL for any uploaded evidence documents
      const caseRecord = rpcResult.data;
      if (caseRecord.evidence_file_path) {
        try {
          const { data: signedData } = await supabase.storage
            .from("dispute-evidence")
            .createSignedUrl(caseRecord.evidence_file_path, 300); // Valid for 300 seconds (5 minutes)
          
          if (signedData?.signedUrl) {
            caseRecord.signed_evidence_url = signedData.signedUrl;
          }
        } catch (storageErr) {
          console.warn("Storage signed URL error:", storageErr);
        }
      }

      return new Response(
        JSON.stringify({ success: true, data: caseRecord }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "BAD_REQUEST", message: "Unsupported action." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Function error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "INTERNAL_ERROR", message: "An unexpected error occurred." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
