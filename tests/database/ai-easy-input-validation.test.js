import assert from "node:assert";
import { validateAssessmentPayload } from "../../src/lib/legalAssessmentValidation.js";
import { generateInstitutionalAssessment } from "../../api/legal-outcome.js";

console.log("=================================================================");
console.log("   TESTING EASY AI INPUT ENRICHMENT & ZERO-ERROR PREDICTION      ");
console.log("=================================================================\n");

// Test 1: User enters only a bare number (e.g. 150000)
console.log("--> Test 1: Bare numeric string / minimal claim value...");
const test1Payload = { claimValue: "150000" };
const res1 = validateAssessmentPayload(test1Payload);
assert.strictEqual(res1.isValid, true, "Payload should be valid");
assert.strictEqual(res1.errors.length, 0, "Errors array should be empty");
assert.strictEqual(res1.sanitized.claimValue, 150000, "Claim value should be parsed as 150000");
assert.ok(res1.sanitized.factualChronology.length > 50, "Auto-synthesizes full factual chronology");
assert.ok(res1.sanitized.primaryClaims.includes("Sections 70 & 73"), "Auto-synthesizes statutory claims");

const report1 = generateInstitutionalAssessment(res1.sanitized);
assert.ok(report1.assessmentSummary.includes("1,50,000"), "Report correctly reflects INR 1.5 Lakhs quantum");
assert.strictEqual(report1.verifiedAuthorities.length, 3, "Curated authorities attached");
console.log("    [PASS] Bare numeric string produces complete, valid AI outcome report.");

// Test 2: User enters number in breachDetails or desiredResolution (e.g. "Payment of 2500000 overdue")
console.log("\n--> Test 2: Numeric amount extracted from short text description...");
const test2Payload = { breachDetails: "Overdue bills totaling 2500000 since last quarter" };
const res2 = validateAssessmentPayload(test2Payload);
assert.strictEqual(res2.isValid, true);
assert.strictEqual(res2.sanitized.claimValue, 2500000, "Extracts 25,00,000 from text");
assert.ok(res2.sanitized.breachDetails.includes("Overdue bills totaling 2500000"), "Preserves user description");
console.log("    [PASS] Extracts claim amount and preserves user description seamlessly.");

// Test 3: Completely empty payload (user clicks "Instant Assess Now" on blank form)
console.log("\n--> Test 3: Empty / zero-input payload instant evaluation...");
const test3Payload = {};
const res3 = validateAssessmentPayload(test3Payload);
assert.strictEqual(res3.isValid, true);
assert.strictEqual(res3.sanitized.claimValue, 1500000, "Applies standard commercial benchmark ₹15 Lakhs");
assert.strictEqual(res3.sanitized.category, "Commercial Contract & Supply Default");
const report3 = generateInstitutionalAssessment(res3.sanitized);
assert.ok(report3.likelyOutcomeScenarios.length >= 3, "Generates full outcome scenarios");
console.log("    [PASS] Zero-input instant evaluation executes with benchmark defaults.");

// Test 4: Preset dispute payload
console.log("\n--> Test 4: Preset dispute payload...");
const test4Payload = {
  category: "MSME Delayed Payments (MSMED Act 2006)",
  claimValue: 450000,
  breachDetails: "Delayed MSME vendor supplies with compound interest under Section 16 MSMED Act 2006",
  factualChronology: "1. MSME Udyam registration active.\n2. Goods delivered and accepted.\n3. 45-day statutory payment window elapsed.",
  primaryClaims: "Principal recovery of INR 4,50,000 plus compound interest with monthly rests at 3x RBI bank rate."
};
const res4 = validateAssessmentPayload(test4Payload);
assert.strictEqual(res4.isValid, true);
assert.strictEqual(res4.sanitized.category, "MSME Delayed Payments (MSMED Act 2006)");
assert.strictEqual(res4.sanitized.claimValue, 450000);
const report4 = generateInstitutionalAssessment(res4.sanitized);
assert.strictEqual(report4.likelyOutcomeScenarios[0].likelihoodBand, "More Likely");
console.log("    [PASS] MSME Preset generates authoritative risk assessment.");

console.log("\n=================================================================");
console.log("   ALL EASY INPUT ENRICHMENT TESTS PASSED: 4/4 (100%)            ");
console.log("=================================================================\n");
