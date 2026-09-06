import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function generatePin(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return num.toString();
}

function generateDocketNumber(mode: string): string {
  const trackMap: Record<string, string> = {
    NEG: "NEG",
    MED: "MED",
    CON: "CON",
    FTA: "FTA",
    ARB: "ARB",
    LOK: "LOK"
  };
  const code = trackMap[mode] || "ODR";
  const year = new Date().getFullYear();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `JN/${code}/${year}/${randNum}`;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Request size limit check (Max 2MB)
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > 2 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ success: false, error: "PAYLOAD_TOO_LARGE", message: "Dispute submission payload exceeds 2MB limit." }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const {
      claimant_name,
      claimant_email,
      claimant_phone,
      respondent_name,
      respondent_email,
      respondent_phone,
      claim_amount,
      mode,
      dispute_summary,
      relief_sought,
      evidence_file_path
    } = body;

    // 2. Input validation & sanitization
    if (!claimant_name || !claimant_email || !claimant_phone || !respondent_name || !respondent_email || !dispute_summary) {
      return new Response(
        JSON.stringify({ success: false, error: "VALIDATION_ERROR", message: "Required dispute fields are missing." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(claimant_email) || !emailRegex.test(respondent_email)) {
      return new Response(
        JSON.stringify({ success: false, error: "INVALID_EMAIL", message: "Please enter valid email addresses for all parties." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanAmount = Number(claim_amount) || 0;
    const cleanMode = ["NEG", "MED", "CON", "FTA", "ARB", "LOK"].includes(mode) ? mode : "ARB";

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // 3. Generate Docket & Secure 6-Digit PIN
    const docketNumber = generateDocketNumber(cleanMode);
    const rawPin = generatePin();
    const pinHash = await bcrypt.hash(rawPin);

    // 4. Insert into disputes table via Service Role
    const { data: dispute, error: insertError } = await supabase
      .from("disputes")
      .insert([
        {
          docket_number: docketNumber,
          claimant_name: claimant_name.trim(),
          claimant_email: claimant_email.trim().toLowerCase(),
          claimant_phone: claimant_phone.trim(),
          respondent_name: respondent_name.trim(),
          respondent_email: respondent_email.trim().toLowerCase(),
          respondent_phone: (respondent_phone || "").trim(),
          claim_amount: cleanAmount,
          mode: cleanMode,
          dispute_summary: dispute_summary.trim(),
          relief_sought: (relief_sought || "").trim(),
          access_code_hash: pinHash,
          evidence_file_path: evidence_file_path || null,
          status: "Notice Issued"
        }
      ])
      .select("id, docket_number, created_at, status, mode")
      .single();

    if (insertError || !dispute) {
      console.error("Dispute Insert Error:", insertError);
      return new Response(
        JSON.stringify({ success: false, error: "DB_ERROR", message: "Failed to create dispute record. Please retry." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Create initial notice_deliveries records with status 'Queued'
    await supabase.from("notice_deliveries").insert([
      {
        dispute_id: dispute.id,
        docket_number: dispute.docket_number,
        recipient_type: "respondent",
        channel: "email",
        recipient_contact: respondent_email.trim().toLowerCase(),
        status: "Queued"
      },
      {
        dispute_id: dispute.id,
        docket_number: dispute.docket_number,
        recipient_type: "respondent",
        channel: "whatsapp",
        recipient_contact: (respondent_phone || "").trim(),
        status: "Queued"
      }
    ]);

    // 6. Return generated Docket Number & One-Time PIN strictly once to claimant
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          docket_number: dispute.docket_number,
          access_pin: rawPin,
          status: dispute.status,
          mode: dispute.mode,
          created_at: dispute.created_at
        }
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Dispute Submission Error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "INTERNAL_ERROR", message: "An unexpected error occurred during submission." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
