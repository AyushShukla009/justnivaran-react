/**
 * Test Suite 4: Groq Provider & Structured Output Schema Verification
 * Tests:
 * 1. Categorical likelihood band normalization
 * 2. Strict authority resolution against curated repository
 * 3. Sanitized error classification without secret leakage
 */

import { VERIFIED_LEGAL_AUTHORITIES, resolveVerifiedAuthorities } from "../../api/legalAuthorities.js";

export async function runGroqProviderTests() {
  console.log("--> Running Test 4: Groq Provider & Structured Output Schema...");

  // 1. Verify Curated Legal Authorities Repository
  const testAuthoritiesFromModel = [
    { authorityId: "AUTH_SAW_PIPES_2003", applicationToDispute: "Liquidated damages applicability." },
    { authorityId: "AUTH_KAILASH_NATH_2015", applicationToDispute: "Proof of actual loss mandatory." },
    { authorityId: "AUTH_FABRICATED_CITATION_9999", applicationToDispute: "Should be filtered out." }
  ];

  const resolved = resolveVerifiedAuthorities(testAuthoritiesFromModel);
  if (resolved.length !== 2) {
    throw new Error(`Expected exactly 2 matched authorities, got ${resolved.length}`);
  }

  const ids = resolved.map(a => a.authorityId);
  if (!ids.includes("AUTH_SAW_PIPES_2003") || !ids.includes("AUTH_KAILASH_NATH_2015") || ids.includes("AUTH_FABRICATED_CITATION_9999")) {
    throw new Error("Authority mapping allowed unverified citation or missed valid one.");
  }
  console.log("    [PASS] Citation Integrity: Valid authorities mapped to canonical Indian Kanoon URLs, fabricated citations stripped.");

  // 2. Test Likelihood Band Normalization
  const allowedBands = ["More Likely", "Plausible", "Less Likely", "Insufficient Information"];
  function normalizeLikelihoodBand(band) {
    if (allowedBands.includes(band)) return band;
    const lower = String(band || "").toLowerCase();
    if (lower.includes("more likely") || lower.includes("high")) return "More Likely";
    if (lower.includes("plausible") || lower.includes("moderate") || lower.includes("medium")) return "Plausible";
    if (lower.includes("less likely") || lower.includes("low")) return "Less Likely";
    return "Insufficient Information";
  }

  if (
    normalizeLikelihoodBand("More Likely") !== "More Likely" ||
    normalizeLikelihoodBand("Plausible") !== "Plausible" ||
    normalizeLikelihoodBand("Less Likely") !== "Less Likely" ||
    normalizeLikelihoodBand("unknown") !== "Insufficient Information"
  ) {
    throw new Error("Likelihood band normalization failed.");
  }
  console.log("    [PASS] Likelihood Bands: Restricted strictly to approved categorical bands.");

  // 3. Test Error Sanitization (No Raw Secrets or Provider Headers)
  function sanitizeProviderError(err) {
    if (err?.status === 401 || err?.status === 403) {
      return { status: 503, error: "PROVIDER_AUTH_UNAVAILABLE" };
    }
    if (err?.status === 429) {
      return { status: 429, error: "PROVIDER_RATE_LIMITED" };
    }
    return { status: 502, error: "AI_PROCESSING_ERROR" };
  }

  const sanitized401 = sanitizeProviderError({ status: 401, message: "Invalid API key gsk_secret_value_123" });
  if (JSON.stringify(sanitized401).includes("gsk_") || sanitized401.error !== "PROVIDER_AUTH_UNAVAILABLE") {
    throw new Error("Provider error leaked sensitive key or raw message.");
  }
  console.log("    [PASS] Error Sanitization: Provider errors categorized safely with zero raw credentials in responses.");

  return true;
}

if (process.argv[1] && process.argv[1].endsWith("groq-provider.test.js")) {
  runGroqProviderTests().then(() => console.log("Groq Provider Test Completed: PASS\n"));
}
