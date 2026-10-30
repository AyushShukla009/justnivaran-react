/**
 * Automated Verification Suite for JustNivaran Deterministic Legal Engine (v3.1)
 * Location: tests/engine/deterministic-engine.test.js
 *
 * All tests use a fixed reference date (FIXED_TODAY: 2026-10-27T00:00:00Z)
 * ensuring 100% deterministic, drift-free execution.
 */

import assert from "node:assert";
import {
  calculateLimitation,
  checkSection12A,
  checkMSMEDApplicability,
  calculateProcessComparison,
  determineRecommendedForum,
  calculateStrengthRatings,
  generateDeterministicAssessment,
  BENCHMARK_PRESETS,
  RBI_BANK_RATE,
  RBI_RATE_HISTORY
} from "../../src/lib/deterministicEngine.js";
import { FEE_SLABS, calculateAuthoritativeFee } from "../../src/lib/feeSchedule.js";

// FIXED "TODAY" DATE INJECTED ACROSS ENTIRE TEST SUITE
const FIXED_TODAY = new Date("2026-10-27T00:00:00Z");

console.log("\n===============================================================================");
console.log("  JUSTNIVARAN DETERMINISTIC STATUTORY ENGINE TEST SUITE (v3.1)");
console.log(`  Fixed Reference Date: ${FIXED_TODAY.toISOString().split("T")[0]}`);
console.log("===============================================================================\n");

let passedTests = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// ----------------------------------------------------------------------------
// TEST 1: RBI BANK RATE (5.75% -> 3x = 17.25%) & DATED HISTORY TABLE
// ----------------------------------------------------------------------------
runTest("RBI Bank Rate: 5.75% (effective 07 Oct 2026) -> 3x = 17.25% with dated history", () => {
  assert.strictEqual(RBI_BANK_RATE, 0.0575);
  assert.ok(Array.isArray(RBI_RATE_HISTORY));
  assert.strictEqual(RBI_RATE_HISTORY[0].effectiveDate, "2026-10-07");
  assert.strictEqual(RBI_RATE_HISTORY[0].bankRate, 0.0575);
  assert.strictEqual(RBI_RATE_HISTORY[0].statutory3xRate, 0.1725);
});

// ----------------------------------------------------------------------------
// TEST 2: MSMED APPOINTED DAY & SECTION 19 PRE-DEPOSIT REWORDING
// ----------------------------------------------------------------------------
runTest("MSMED: Interest runs from Section 15 Appointed Day (acceptance + credit <= 45 days)", () => {
  const res = checkMSMEDApplicability({
    enterpriseType: "Small",
    udyamRegisteredAtContract: true,
    claimQuantum: 450000,
    acceptanceDate: "2025-11-28",
    agreedCreditDays: 43,
    asOfDate: FIXED_TODAY,
    rbiBankRate: RBI_BANK_RATE
  });

  assert.strictEqual(res.applicable, true);
  assert.strictEqual(res.statutoryInterestRate, 0.1725); // 17.25%
  assert.strictEqual(res.statutoryInterestRatePercent, "17.25%");
  assert.strictEqual(res.appointedDay, "2026-01-10");
  assert.strictEqual(res.interestStartDate, "2026-01-10");
  assert.ok(res.interestStartExplanation.includes("appointed day (2026-01-10)"));
  assert.strictEqual(res.daysOverdueFromAppointedDay, 290);
  assert.ok(res.estimatedStatutoryInterest > 0);

  // Section 19 accurate judicial wording
  assert.ok(res.section19PreDepositRule.includes("applies only if the buyer files an application before a court to set aside an award"));
});

// ----------------------------------------------------------------------------
// TEST 3: SECTION 18 LIMITATION RESET & SUBJECT TO REVIEW
// ----------------------------------------------------------------------------
runTest("Limitation: Section 18 marked as 'possible reset, subject to review' (not verified)", () => {
  const res = calculateLimitation({
    breachDate: "2024-06-30",
    acknowledgmentDate: "2025-08-15",
    signedWrittenAcknowledgment: true,
    acknowledgmentDocumentType: "Joint Site Measurement Sheet",
    asOfDate: FIXED_TODAY
  });

  assert.strictEqual(res.hasSection18Acknowledgment, true);
  assert.strictEqual(res.signedWrittenAcknowledgment, true);
  assert.ok(res.acknowledgmentReviewNote.includes("Possible reset under Section 18 Limitation Act"));
  assert.ok(res.acknowledgmentReviewNote.includes("subject to formal adjudicatory review"));
  assert.strictEqual(res.status, "In time");
  assert.strictEqual(res.daysRemaining, 658);
});

// ----------------------------------------------------------------------------
// TEST 4: SECTION 12A COMMERCIAL COURTS ACT CLARIFICATIONS
// ----------------------------------------------------------------------------
runTest("Section 12A: Prerequisite for court filing + DLSA/SLSA verification note", () => {
  // Case with NO arbitration clause
  const courtRes = checkSection12A({
    claimQuantum: 1000000,
    hasArbitrationClause: false,
    urgentInterimRelief: false,
    isCommercial: true
  });
  assert.strictEqual(courtRes.applicable, true);
  assert.strictEqual(courtRes.mandatory, true);
  assert.ok(courtRes.statutoryAdvisory.includes("State or District Legal Services Authorities - SLSA/DLSA"));

  // Case with arbitration clause
  const arbRes = checkSection12A({
    claimQuantum: 1000000,
    hasArbitrationClause: true,
    isCommercial: true
  });
  assert.strictEqual(arbRes.applicable, false);
  assert.strictEqual(arbRes.status, "Not Required (Arbitration Governs)");
});

// ----------------------------------------------------------------------------
// TEST 5: CONFIRM FEE FIGURES MATCH /fee-schedule ACROSS SLABS
// ----------------------------------------------------------------------------
runTest("Fee Schedule: strictly matches /fee-schedule across all 4 slabs", () => {
  // Slab 1: Up to ₹5L (e.g. ₹4,50,000)
  const slab1Neg = calculateAuthoritativeFee(450000, "negotiation");
  assert.strictEqual(slab1Neg.baseFee, 2500);
  assert.strictEqual(slab1Neg.totalWithGst, 2950);

  const slab1Med = calculateAuthoritativeFee(450000, "mediation");
  assert.strictEqual(slab1Med.baseFee, 7500);
  assert.strictEqual(slab1Med.totalWithGst, 8850);

  const slab1Arb = calculateAuthoritativeFee(450000, "arbitration");
  assert.strictEqual(slab1Arb.baseFee, 15000);
  assert.strictEqual(slab1Arb.totalWithGst, 17700);

  // Slab 2: ₹5L - ₹25L (e.g. ₹15,00,000)
  const slab2Neg = calculateAuthoritativeFee(1500000, "negotiation");
  assert.strictEqual(slab2Neg.baseFee, 5000);
  assert.strictEqual(slab2Neg.totalWithGst, 5900);

  const slab2Med = calculateAuthoritativeFee(1500000, "mediation");
  assert.strictEqual(slab2Med.baseFee, 18000);
  assert.strictEqual(slab2Med.totalWithGst, 21240);

  const slab2Arb = calculateAuthoritativeFee(1500000, "arbitration");
  assert.strictEqual(slab2Arb.baseFee, 35000);
  assert.strictEqual(slab2Arb.totalWithGst, 41300);

  // Slab 3: ₹25L - ₹1Cr (e.g. ₹50,00,000)
  const slab3Arb = calculateAuthoritativeFee(5000000, "arbitration");
  assert.strictEqual(slab3Arb.baseFee, 65000);
  assert.strictEqual(slab3Arb.totalWithGst, 76700);

  // Slab 4: > ₹1Cr (e.g. ₹2,00,00,000)
  const slab4Med = calculateAuthoritativeFee(20000000, "mediation");
  assert.strictEqual(slab4Med.baseFee, 70000); // 0.35% of ₹2Cr = ₹70,000
});

// ----------------------------------------------------------------------------
// TEST 6: PRESET 4 SEPARATION OF CLAIMANT GAPS VS DEFENCE STRENGTH
// ----------------------------------------------------------------------------
runTest("Preset 4: Claimant weaknesses separated into claimantGaps / evidenceGaps", () => {
  const p4 = BENCHMARK_PRESETS[3];
  const d4 = generateDeterministicAssessment({
    ...p4,
    asOfDate: FIXED_TODAY
  });

  // Defence reasons must contain only substantive defenses
  assert.ok(d4.defenceStrength.reasons.some((r) => r.includes("warranty")));
  assert.ok(!d4.defenceStrength.reasons.some((r) => r.includes("Absence of physical stamped delivery")));

  // User fix 1: Preset 4 claimant strength must be Moderate due to procedural gaps and missing proof of acceptance
  assert.strictEqual(d4.claimStrength.rating, "Moderate");
  assert.ok(d4.msmed.deemedAcceptanceNote.includes("deemed-acceptance"));

  // Claimant gaps must contain procedural omissions
  assert.ok(d4.claimantGaps.some((g) => g.includes("Absence of physical stamped delivery challan")));
  assert.ok(d4.claimantGaps.some((g) => g.includes("No prior formal statutory demand notice")));
});

// ----------------------------------------------------------------------------
// TEST 7: PRINT UPDATED OUTPUTS FOR PRESET 2 & PRESET 4
// ----------------------------------------------------------------------------
console.log("\n-------------------------------------------------------------------------------");
console.log("  PRINTING UPDATED OUTPUTS FOR PRESET 2 AND PRESET 4 (AS REQUESTED)");
console.log("-------------------------------------------------------------------------------\n");

[1, 3].forEach((idx) => {
  const preset = BENCHMARK_PRESETS[idx];
  const dossier = generateDeterministicAssessment({
    ...preset,
    asOfDate: FIXED_TODAY
  });

  console.log(`=============================================================================`);
  console.log(`  UPDATED ${preset.label} [${preset.category}]`);
  console.log(`=============================================================================`);
  console.log(`• Dossier Reference:      ${dossier.requestId}`);
  console.log(`• Engine Attribution:     ${dossier.engineType} (${dossier.modelUsed})`);
  console.log(`• Principal Claim:        ${dossier.claimQuantumFormatted}`);
  console.log(`• Enterprise Type:        ${preset.enterpriseType} | Udyam at Contract: ${preset.udyamRegisteredAtContract ? "Yes" : "No"}`);
  console.log(`-----------------------------------------------------------------------------`);
  console.log(`1. LIMITATION ASSESSMENT (Articles 55 & 113, Limitation Act 1963):`);
  console.log(`   - Status:              ${dossier.limitation.status} (${dossier.limitation.label})`);
  console.log(`   - Breach Date:         ${dossier.limitation.breachDate}`);
  console.log(`   - Expiry Date:         ${dossier.limitation.expiryDate}`);
  console.log(`   - Days Remaining:      ${dossier.limitation.daysRemaining} days (Fixed as-of: 2026-10-27)`);
  if (dossier.limitation.acknowledgmentReviewNote) {
    console.log(`   - Section 18 Note:     ${dossier.limitation.acknowledgmentReviewNote}`);
  }
  console.log(`-----------------------------------------------------------------------------`);
  console.log(`2. SECTION 12A COMMERCIAL COURTS ACT 2015:`);
  console.log(`   - Status:              ${dossier.section12A.status}`);
  console.log(`   - Mandatory Pre-Med:   ${dossier.section12A.mandatory ? "YES" : "NO"}`);
  console.log(`   - Rationale:           ${dossier.section12A.rationale}`);
  if (dossier.section12A.statutoryAdvisory) {
    console.log(`   - Statutory Advisory:  ${dossier.section12A.statutoryAdvisory}`);
  }
  console.log(`-----------------------------------------------------------------------------`);
  console.log(`3. MSMED ACT 2006 (SECTIONS 15, 16, 18 & 19):`);
  console.log(`   - Status:              ${dossier.msmed.applicable ? "APPLICABLE (Micro/Small Qualified)" : "NOT APPLICABLE"}`);
  if (dossier.msmed.applicable) {
    console.log(`   - Section 15 Base:     Acceptance Date: ${dossier.msmed.baseDateUsed} | Agreed Credit: ${dossier.msmed.statutoryCreditDaysCapped} days (Capped at 45)`);
    console.log(`   - Appointed Day:       ${dossier.msmed.appointedDay}`);
    console.log(`   - Interest Start:      ${dossier.msmed.interestStartExplanation}`);
    console.log(`   - Interest Rate:       ${dossier.msmed.interestRateLabel}`);
    console.log(`   - Days Overdue:        ${dossier.msmed.daysOverdueFromAppointedDay} days (${dossier.msmed.monthsOverdue} months)`);
    console.log(`   - Overdue Interest:    ₹ ${dossier.msmed.estimatedStatutoryInterest.toLocaleString("en-IN")}`);
    console.log(`   - Total Claim + Int:   ₹ ${dossier.msmed.totalClaimWithInterest.toLocaleString("en-IN")}`);
    console.log(`   - Section 19 Rule:     ${dossier.msmed.section19PreDepositRule}`);
  }
  console.log(`-----------------------------------------------------------------------------`);
  console.log(`4. RECOMMENDED FORUM:`);
  console.log(`   - Primary:             ${dossier.forumRecommendation.recommendedForum}`);
  console.log(`   - Statutory Basis:     ${dossier.forumRecommendation.statutoryBasis}`);
  console.log(`   - Rationale:           ${dossier.forumRecommendation.rationale}`);
  console.log(`-----------------------------------------------------------------------------`);
  console.log(`5. INSTITUTIONAL STRENGTH EVALUATION:`);
  console.log(`   - Claimant Strength:   ${dossier.claimStrength.rating}`);
  dossier.claimStrength.reasons.forEach((r) => console.log(`     * ${r}`));
  console.log(`   - Defence Strength:    ${dossier.defenceStrength.rating}`);
  dossier.defenceStrength.reasons.forEach((r) => console.log(`     * ${r}`));
  console.log(`   - Gaps in Claimant's Case:`);
  dossier.claimantGaps.forEach((g) => console.log(`     [!] ${g}`));
  console.log(`   - Evidentiary Missing Items:`);
  dossier.evidenceGaps.forEach((g) => console.log(`     [?] ${g}`));
  console.log(`-----------------------------------------------------------------------------`);
  console.log(`6. PROCESS COMPARISON MATRIX (Matches /fee-schedule):`);
  dossier.processComparison.forEach((p) => {
    console.log(`   • ${p.name.padEnd(38)} | Fee: ₹${p.totalWithGst.toLocaleString("en-IN")} incl. GST (${p.slabLabel}) | Consent: ${p.consentRequirement}`);
  });
  console.log(`-----------------------------------------------------------------------------\n`);
});

console.log("===============================================================================");
console.log(`  ALL ${passedTests} TESTS PASSED CLEANLY WITH ZERO ERRORS`);
console.log("===============================================================================\n");
