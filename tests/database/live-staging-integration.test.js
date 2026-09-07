/**
 * Test Suite 6: Live Staging PostgreSQL Integration Test
 * Verifies against REAL Staging PostgreSQL (Reference: hyasutbswsodbycarewm):
 * 1. Safe Execution of exact migration: supabase-production-hardening.sql
 * 2. Immutable Audit Trigger: Real PostgreSQL throws TAMPER_DETECTED on UPDATE/DELETE on case_audit_logs.
 * 3. Real pgcrypto/bcrypt Authentication via internal_verify_docket_pin.
 * 4. Real Administrative Case Recovery via admin_recover_case_pin.
 * 5. Notice Delivery record creation and dispatch targeting controlled test inbox.
 * 
 * Safety Invariant: NEVER connects to or executes against Production (zejzfgogccmmhsjexxml).
 */

import pg from "pg";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const { Client } = pg;

const PROD_REF = "zejzfgogccmmhsjexxml";
const STAGING_REF = "hyasutbswsodbycarewm";

export async function runLiveStagingIntegrationTest() {
  console.log("--> Running Test 6: Real Staging PostgreSQL Integration Test...");

  const dbUrl = process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL;
  const supabaseUrl = process.env.STAGING_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const testInbox = process.env.TEST_INBOX_EMAIL || "test-recovery-intake@justnivaran.test";

  // Safety Pre-Check: Block any connection containing production reference
  if (
    (dbUrl && dbUrl.includes(PROD_REF)) ||
    (supabaseUrl && supabaseUrl.includes(PROD_REF))
  ) {
    throw new Error(`CRITICAL SECURITY VIOLATION: Attempted to run test against Production reference (${PROD_REF}). Aborting immediately.`);
  }

  // Check if live credentials are provided
  if (!dbUrl && (!supabaseUrl || !serviceKey)) {
    console.log("    [LIVE STAGING STATUS]: Direct Staging PostgreSQL credentials NOT configured in local environment.");
    console.log("    [BLOCKER DIAGNOSTIC]:");
    console.log("      - Target Staging Database Reference: hyasutbswsodbycarewm");
    console.log("      - Missing Environment Variables: STAGING_DATABASE_URL (or STAGING_SUPABASE_URL + STAGING_SUPABASE_SERVICE_ROLE_KEY)");
    console.log("      - Current Secret Storage: Staging credentials reside remotely in Vercel Preview secrets and are not available in local Node environment.");
    console.log("      - Required to Run Live: Provide STAGING_DATABASE_URL (or STAGING_SUPABASE_SERVICE_ROLE_KEY) or pull from Vercel.");
    console.log("Live Staging Test: BLOCKED (Missing Staging Database Connection Credentials)\n");
    return {
      status: "BLOCKED",
      reason: "MISSING_STAGING_CREDENTIALS",
      target_staging_ref: STAGING_REF
    };
  }

  // If direct PostgreSQL connection is available
  if (dbUrl) {
    const client = new Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log(`    [CONNECTED]: Connected to live PostgreSQL database (Staging: ${STAGING_REF})`);

      // 1. Verify Migration Execution
      const migrationSql = fs.readFileSync("/Users/ayushshukla/Desktop/justnivaran-react/supabase-production-hardening.sql", "utf-8");
      await client.query(migrationSql);
      console.log("    [PASS] Live Migration DDL: Successfully applied supabase-production-hardening.sql to staging PostgreSQL.");

      // 2. Test Real CSPRNG PIN Function
      const pinRes = await client.query("SELECT public.generate_secure_numeric_pin() AS pin;");
      const realPin = pinRes.rows[0].pin;
      if (!/^[1-9][0-9]{5}$/.test(realPin)) {
        throw new Error(`Real CSPRNG PIN out of bounds: ${realPin}`);
      }
      console.log(`    [PASS] Real PostgreSQL CSPRNG: Generated valid 6-digit PIN (${realPin}).`);

      // 3. Test Real Public Dispute Filing RPC
      const fileRes = await client.query(`
        SELECT public.submit_public_dispute(
          'Live Claimant Test',
          $1,
          '+919876543210',
          'Live Respondent Test',
          'respondent-live@test.com',
          '+919876543211',
          500000.00,
          'ARB',
          'Live contract dispute testing real staging database.',
          'Payment recovery',
          NULL
        ) AS result;
      `, [testInbox]);

      const filingData = fileRes.rows[0].result;
      if (!filingData.success) {
        throw new Error(`submit_public_dispute failed: ${JSON.stringify(filingData)}`);
      }
      const liveDocket = filingData.data.docket_number;
      const initialPin = filingData.data.access_pin;
      console.log(`    [PASS] Live Dispute Filing: Matter created with docket ${liveDocket} and initial PIN ${initialPin}.`);

      // 4. Test Real Audit Log Immutability (UPDATE & DELETE Rejection)
      const auditRows = await client.query("SELECT id FROM public.case_audit_logs WHERE docket_number = $1;", [liveDocket]);
      if (auditRows.rows.length === 0) {
        throw new Error("Audit log entry was not created by trigger on dispute insert.");
      }
      const auditId = auditRows.rows[0].id;

      let updateRejected = false;
      try {
        await client.query("UPDATE public.case_audit_logs SET change_summary = 'Tampered log' WHERE id = $1;", [auditId]);
      } catch (err) {
        if (err.message.includes("TAMPER_DETECTED") || err.message.includes("immutable")) {
          updateRejected = true;
        }
      }
      if (!updateRejected) {
        throw new Error("Live audit log UPDATE was permitted! Immutability trigger failed.");
      }

      let deleteRejected = false;
      try {
        await client.query("DELETE FROM public.case_audit_logs WHERE id = $1;", [auditId]);
      } catch (err) {
        if (err.message.includes("TAMPER_DETECTED") || err.message.includes("immutable")) {
          deleteRejected = true;
        }
      }
      if (!deleteRejected) {
        throw new Error("Live audit log DELETE was permitted! Immutability trigger failed.");
      }
      console.log("    [PASS] Live Audit Immutability: Real PostgreSQL trigger rejected UPDATE and DELETE on case_audit_logs.");

      // 5. Test Real Administrative Case Recovery RPC
      const recoverRes = await client.query(`
        SELECT public.admin_recover_case_pin($1, 'claimant') AS result;
      `, [liveDocket]);

      const recoveryData = recoverRes.rows[0].result;
      if (!recoveryData.success) {
        throw new Error(`admin_recover_case_pin failed: ${JSON.stringify(recoveryData)}`);
      }
      const recoveredPin = recoveryData.data.generated_pin;
      console.log(`    [PASS] Live Administrative Case Recovery: Generated fresh PIN (${recoveredPin}) for docket ${liveDocket}.`);

      // 6. Verify Notice Delivery Record Created for Controlled Test Inbox
      const noticeRes = await client.query(`
        SELECT id, recipient_contact, channel, status FROM public.notice_deliveries 
        WHERE docket_number = $1 AND recipient_type = 'claimant' 
        ORDER BY created_at DESC LIMIT 1;
      `, [liveDocket]);

      if (noticeRes.rows.length === 0 || noticeRes.rows[0].recipient_contact !== testInbox) {
        throw new Error(`Notice delivery record missing for test inbox: ${testInbox}`);
      }
      console.log(`    [PASS] Live Notice Delivery Queue: Recovery notice created targeting test inbox (${testInbox}) with status "${noticeRes.rows[0].status}".`);

      // 7. Test Real Bcrypt Authentication via internal_verify_docket_pin
      const clientHash = "a".repeat(64);
      
      // Test Invalid PIN
      const invalidVerifyRes = await client.query(`
        SELECT public.internal_verify_docket_pin($1, '000000', $2) AS result;
      `, [liveDocket, clientHash]);
      if (invalidVerifyRes.rows[0].result.success) {
        throw new Error("Invalid PIN succeeded authentication on live database!");
      }

      // Test Real Recovered PIN
      const validVerifyRes = await client.query(`
        SELECT public.internal_verify_docket_pin($1, $2, $3) AS result;
      `, [liveDocket, recoveredPin, clientHash]);

      const authData = validVerifyRes.rows[0].result;
      if (!authData.success || authData.data.docket_number !== liveDocket) {
        throw new Error(`Live bcrypt PIN authentication failed for recovered PIN (${recoveredPin}): ${JSON.stringify(authData)}`);
      }
      console.log(`    [PASS] Live Real Bcrypt Authentication: Successfully authenticated into case dossier using recovered PIN (${recoveredPin}).`);

      console.log("Live Staging PostgreSQL Integration Test Completed: ALL PASS\n");
      return { status: "PASS", target_staging_ref: STAGING_REF };
    } finally {
      await client.end();
    }
  }

  // If Supabase JS Client is used
  if (supabaseUrl && serviceKey) {
    const supabase = createClient(supabaseUrl, serviceKey);
    console.log(`    [CONNECTED]: Connected via Supabase Service Client (Staging: ${STAGING_REF})`);

    // Call submit_public_dispute
    const { data: filingData, error: filingErr } = await supabase.rpc("submit_public_dispute", {
      p_claimant_name: "Live Supabase Claimant",
      p_claimant_email: testInbox,
      p_claimant_phone: "+919876543210",
      p_respondent_name: "Live Supabase Respondent",
      p_respondent_email: "respondent-sb@test.com",
      p_claim_amount: 300000,
      p_mode: "ARB",
      p_dispute_summary: "Live Supabase RPC test",
      p_relief_sought: "Settlement",
      p_evidence_file_path: null
    });

    if (filingErr || !filingData?.success) {
      throw new Error(`submit_public_dispute RPC failed: ${filingErr?.message || JSON.stringify(filingData)}`);
    }
    const liveDocket = filingData.data.docket_number;
    console.log(`    [PASS] Live Supabase RPC Filing: Matter created (${liveDocket}).`);

    // Call admin_recover_case_pin
    const { data: recoverData, error: recoverErr } = await supabase.rpc("admin_recover_case_pin", {
      p_docket: liveDocket,
      p_recipient_channel: "claimant"
    });

    if (recoverErr || !recoverData?.success) {
      throw new Error(`admin_recover_case_pin RPC failed: ${recoverErr?.message || JSON.stringify(recoverData)}`);
    }
    const recoveredPin = recoverData.data.generated_pin;
    console.log(`    [PASS] Live Supabase RPC Recovery: Generated recovered PIN (${recoveredPin}).`);

    // Verify Authentication with Recovered PIN
    const { data: authData, error: authErr } = await supabase.rpc("internal_verify_docket_pin", {
      p_docket: liveDocket,
      p_pin: recoveredPin,
      p_client_hash: "b".repeat(64),
      p_ip_masked: "192.168.1.0/24"
    });

    if (authErr || !authData?.success) {
      throw new Error(`internal_verify_docket_pin failed: ${authErr?.message || JSON.stringify(authData)}`);
    }
    console.log(`    [PASS] Live Supabase RPC Authentication: Successfully verified with recovered PIN (${recoveredPin}).`);

    console.log("Live Staging Supabase Integration Test Completed: ALL PASS\n");
    return { status: "PASS", target_staging_ref: STAGING_REF };
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runLiveStagingIntegrationTest().catch((err) => {
    console.error("Live Staging Test Failed:", err);
    process.exit(1);
  });
}
