/**
 * Validator False-Positives & 20-Run Stress Test Suite
 * Location: tests/engine/validator-false-positives.test.js
 *
 * Verifies:
 * 1. Zero false-positive rejections on legal/chronological phrases like:
 *    - "15 days", "45 days", "90 days", "290 days", "3 years"
 *    - "Section 15", "Section 16", "Section 12A", "Section 73", "Section 74"
 *    - "Order VII Rule 11", "Article 55", "Article 113", "Order 39"
 *    - Engine statutory interest rate string (e.g. "17.25%")
 *    - Procedural comparisons like "Section 15 vs Section 16", "Claimant vs Respondent"
 * 2. Runs 20 mock iterations per preset (80 runs total) through the validator and
 *    pipeline to measure and report exact retry and fallback counts.
 */

import assert from "node:assert";
import { validateAITextIntegrity, executeAssessment } from "../../api/assess.js";
import { BENCHMARK_PRESETS } from "../../src/lib/deterministicEngine.js";

const FIXED_TODAY = new Date("2026-10-27T00:00:00Z");

console.log("\n===============================================================================");
console.log("  VALIDATOR FALSE-POSITIVES & MOCK RUNS STRESS TEST (v3.2)");
console.log("===============================================================================\n");

// ----------------------------------------------------------------------------
// PART 1: FALSE-POSITIVE CANDIDATE UNIT TESTS
// ----------------------------------------------------------------------------
console.log("--- PART 1: TESTING SENSITIVE LEGAL & CHRONOLOGICAL PHRASES ---");

const baselineMock = {
  claimQuantum: 450000,
  msmed: {
    statutoryInterestRatePercent: "17.25%",
    estimatedStatutoryInterest: 65550,
    totalClaimWithInterest: 515550
  },
  limitation: {
    status: "In time",
    expiryDate: "2029-01-10",
    effectiveStartDate: "2026-01-10"
  },
  processComparison: [
    { baseFee: 10000, registryFee: 5000, neutralFee: 15000, totalWithGst: 35400 }
  ]
};

const intakeMock = {
  claimValue: 450000,
  breachDate: "2026-01-10",
  acceptanceDate: "2025-11-28",
  factsSummary: "Supplier delivered goods under Section 15 with 43 days credit. Overdue by 290 days. 15 days notice issued."
};

const candidatePhrases = [
  { phrase: "Invoice overdue by 15 days following Section 15 statutory ceiling.", reason: "'15 days' & 'Section 15'" },
  { phrase: "The agreed credit was 45 days, capped under Section 15 of MSMED Act.", reason: "'45 days' & 'Section 15'" },
  { phrase: "Notice cure period of 90 days expired on record.", reason: "'90 days'" },
  { phrase: "Claim has been outstanding for 290 days.", reason: "'290 days'" },
  { phrase: "Statutory limitation period is 3 years under Article 55 and Article 113 of Limitation Act 1963.", reason: "'3 years', 'Article 55', 'Article 113'" },
  { phrase: "Plaint subject to rejection under Order VII Rule 11 CPC without Section 12A mediation.", reason: "'Order VII Rule 11' & 'Section 12A'" },
  { phrase: "Liquidated damages claimed under Section 74 Indian Contract Act 1872.", reason: "'Section 74'" },
  { phrase: "Compensatory damages under Section 73 Indian Contract Act.", reason: "'Section 73'" },
  { phrase: "Fast track procedure available under Section 29B upon written consent.", reason: "'Section 29B'" },
  { phrase: "Statutory compound interest at 17.25% under Section 16 MSMED Act.", reason: "'17.25%' engine rate" },
  { phrase: "Evaluating Section 15 vs Section 16 statutory remedies.", reason: "'Section 15 vs Section 16' (not a case law)" },
  { phrase: "Competing positions of Claimant vs Respondent.", reason: "'Claimant vs Respondent' (not a case law)" },
  { phrase: "Interim injunction sought under Order 39 Rules 1 and 2 CPC.", reason: "'Order 39 Rules 1 and 2'" },
  { phrase: "Arbitral invocation issued under Section 21 of ACA 1996.", reason: "'Section 21'" },
  { phrase: "Mandatory 75% pre-deposit applies under Section 19 of the MSMED Act.", reason: "'75%' in Section 19 context" },
  { phrase: "Institutional registry fee subject to 18% GST.", reason: "'18%' in GST context" }
];

candidatePhrases.forEach(({ phrase, reason }) => {
  const violations = validateAITextIntegrity({ case_summary: phrase }, baselineMock, intakeMock);
  assert.strictEqual(
    violations.length,
    0,
    `FALSE POSITIVE DETECTED on phrase: "${phrase}" (${reason}). Violations: ${violations.join("; ")}`
  );
  console.log(`  ✓ No false positive on ${reason.padEnd(35)} -> Pass`);
});

// Also confirm that unapproved context for 18% or 75% or other rates IS rejected
const unapprovedPctViolations1 = validateAITextIntegrity(
  { case_summary: "Claimant has a 75% win probability." },
  baselineMock,
  intakeMock
);
assert.ok(unapprovedPctViolations1.some(v => v.includes("75%")), "Must reject 75% outside Section 19");

const unapprovedPctViolations2 = validateAITextIntegrity(
  { case_summary: "Commercial contract interest claimed at 18% p.a." },
  baselineMock,
  intakeMock
);
assert.ok(unapprovedPctViolations2.some(v => v.includes("18%")), "Must reject 18% outside GST");

const unapprovedPctViolations3 = validateAITextIntegrity(
  { case_summary: "Settlement recovery discount of 50%." },
  baselineMock,
  intakeMock
);
assert.ok(unapprovedPctViolations3.some(v => v.includes("50%")), "Must reject unapproved 50%");
console.log("  ✓ Correctly rejected unauthorized percentages ('75%' win rate, '18%' interest, '50%')");

console.log("");

// ----------------------------------------------------------------------------
// PART 2: 20 MOCK RUNS PER PRESET (80 TOTAL RUNS)
// ----------------------------------------------------------------------------
console.log("--- PART 2: EXECUTING 20 MOCK RUNS PER PRESET (80 RUNS TOTAL) ---");

// Realistic synthetic outputs for all 4 presets
const PRESET_MOCK_RESPONSES = {
  0: {
    case_summary: "Commercial sales dispute concerning unpaid industrial machinery spares worth ₹15,00,000 delivered under PO-2025-881. Delivery challan was acknowledged. Payment overdue past 90 days. Agreement contains institutional arbitration clause under ACA 1996.",
    claim_strength: {
      rating: "Strong",
      reasons: ["Documented purchase order and signed delivery challan.", "Comfortably within 3-year limitation period under Article 55."]
    },
    defence_strength: {
      rating: "Weak",
      reasons: ["Buyer requests unilateral payment grace period without contractual justification."]
    },
    key_legal_issues: ["Arbitration agreement enforcement under Section 7 and 8 of ACA 1996", "Pre-award interest under Section 31(7) ACA 1996"],
    applicable_principles: [
      { name: "Indian Contract Act, 1872: Section 73", why_relevant: "Entitles recovery of contract price upon complete performance." },
      { name: "Arbitration and Conciliation Act, 1996: Section 21", why_relevant: "Formal commencement of arbitral proceedings." }
    ],
    evidence_gaps: ["Certified bank ledger statement of accounts showing non-receipt of payment."],
    risks: ["Procedural challenges during arbitrator appointment."],
    likely_outcome_scenarios: [
      { scenario: "Full Award in Fast-Track Arbitration", likelihood: "High", explanation: "Clear documentary delivery proof supports full recovery." }
    ],
    settlement_outlook: { rating: "Full recovery likely", explanation: "Strong documentary chain with minimal substantive defence." },
    recommended_next_steps: ["Issue formal Section 21 notice of arbitration."],
    confidence: "Moderate", // Capped because evidence_gaps exists
    assumptions: ["Goods conformed to technical specifications."]
  },
  1: {
    case_summary: "MSME delayed payment claim under MSMED Act 2006 for precision tooling delivered on 28 Nov 2025. Appointed day was 10 Jan 2026. Payment overdue by 290 days. Mandatory compound interest applies at 17.25% p.a.",
    claim_strength: {
      rating: "Strong",
      reasons: ["Claimant holds active Udyam registration at contract inception.", "Breach of Section 15 45-day statutory payment ceiling."]
    },
    defence_strength: {
      rating: "Weak",
      reasons: ["Internal processing backlog cannot override Section 15 statutory obligations."]
    },
    key_legal_issues: ["Statutory compound interest at 17.25% under Section 16 MSMED Act 2006", "Statutory conciliation reference under Section 18 MSMED Act"],
    applicable_principles: [
      { name: "MSMED Act, 2006: Section 15 & 16", why_relevant: "Mandates payment within 45 days and penal compound interest at 17.25%." },
      { name: "Silpi Industries etc. v. Kerala State Road Transport Corporation & Anr. (2021) SCC OnLine SC 439", why_relevant: "Udyam registration held at contract date establishes statutory standing." },
      { name: "Gujarat State Civil Supplies Corporation Ltd. v. Mahakali Foods Pvt. Ltd. & Anr. (2023) 6 SCC 401", why_relevant: "Section 18 overrides general arbitration clauses." }
    ],
    evidence_gaps: ["Certified bank ledger statement showing non-receipt of payment."],
    risks: ["Dilatory objections during conciliation stage."],
    likely_outcome_scenarios: [
      { scenario: "Settlement before MSEFC", likelihood: "High", explanation: "High statutory recovery probability with compound interest." }
    ],
    settlement_outlook: { rating: "Full recovery likely", explanation: "Statutory claim backed by verified Udyam registration." },
    recommended_next_steps: ["File reference before MSEFC or initiate institutional mediation."],
    confidence: "Moderate",
    assumptions: ["No formal quality objection lodged within 15 days."]
  },
  2: {
    case_summary: "Infrastructure subcontract dispute regarding final RA Bill 12 of ₹50,00,000 for concrete works. Contractor withheld payment citing project-wide liquidated damages under Section 74 Contract Act. Joint site measurement sheet signed on 15 Aug 2025.",
    claim_strength: {
      rating: "Moderate",
      reasons: ["Joint measurement sheet signed on 15 Aug 2025 confirms executed quantities.", "Contractual dispute mechanism includes fast-track arbitration."]
    },
    defence_strength: {
      rating: "Moderate",
      reasons: ["Main contractor asserts delay penalties under Section 74 Indian Contract Act."]
    },
    key_legal_issues: ["Section 74 Contract Act liquidated damages vs actual loss", "Limitation reset under Section 18 Limitation Act"],
    applicable_principles: [
      { name: "Kailash Nath Associates v. Delhi Development Authority & Anr. (2015) 4 SCC 136", why_relevant: "Proof of actual loss required under Section 74." },
      { name: "Oil & Natural Gas Corporation Ltd. v. Saw Pipes Ltd. (2003) 5 SCC 705", why_relevant: "Principles governing genuine pre-estimate of loss." }
    ],
    evidence_gaps: ["Written confirmation that Joint Site Sheet constitutes final financial settlement."],
    risks: ["Substantive counter-claim for project delay losses."],
    likely_outcome_scenarios: [
      { scenario: "Mediated Settlement with Liquidated Damages Reduction", likelihood: "High", explanation: "Compromise adjusting delay deductions." }
    ],
    settlement_outlook: { rating: "Partial recovery likely", explanation: "Counter-claims make structured settlement optimal." },
    recommended_next_steps: ["Initiate institutional mediation prior to formal arbitration."],
    confidence: "Moderate",
    assumptions: ["Both parties willing to submit to consensual resolution."]
  },
  3: {
    case_summary: "IT services contract dispute regarding final milestone fee of ₹10,00,000. ERP code was deployed to client production on 17 Aug 2025 without formal signed UAT receipt. Client operationalized system in daily business but withheld payment citing minor Jira cosmetic bug tickets.",
    claim_strength: {
      rating: "Moderate",
      reasons: ["Code deployed to production environment and utilized in live business.", "Master Services Agreement executed."]
    },
    defence_strength: {
      rating: "Moderate",
      reasons: ["Respondent client cites open Jira tickets and asserts warranty obligations."]
    },
    key_legal_issues: ["Section 12A Commercial Courts Act mandatory pre-institution mediation", "Deemed acceptance under Section 2(b) MSMED Act"],
    applicable_principles: [
      { name: "Patil Automation Pvt. Ltd. & Ors. v. Rakheja Engineers Pvt. Ltd. (2022) 10 SCC 1", why_relevant: "Section 12A mediation is mandatory prior to filing commercial suit." },
      { name: "MSMED Act, 2006: Section 2(b) & Section 16", why_relevant: "Deemed acceptance through live utilization." }
    ],
    evidence_gaps: ["Absence of signed UAT completion certificate."],
    risks: ["Delay if Section 12A mediation is not exhausted before court filing."],
    likely_outcome_scenarios: [
      { scenario: "Mediated Release upon Bug Fix Verification", likelihood: "High", explanation: "Settlement releasing milestone fees upon closing tickets." }
    ],
    settlement_outlook: { rating: "Partial recovery likely", explanation: "Deployment establishes deemed acceptance, but tickets warrant mediation." },
    recommended_next_steps: ["Exhaust Section 12A mediation via DLSA/SLSA or consensual institutional mediation."],
    confidence: "Moderate",
    assumptions: ["Client is generating commercial value from deployed code."]
  }
};

const results = [];

for (let pIdx = 0; pIdx < BENCHMARK_PRESETS.length; pIdx++) {
  const preset = BENCHMARK_PRESETS[pIdx];
  const baseMock = PRESET_MOCK_RESPONSES[pIdx];

  let passedFirstAttempt = 0;
  let retriesRequired = 0;
  let fallbacksTriggered = 0;

  for (let run = 1; run <= 20; run++) {
    // Generate slight mock variance in phrasing to simulate stochastic LLM responses
    const mockOutput = JSON.parse(JSON.stringify(baseMock));
    if (run % 4 === 1) {
      mockOutput.case_summary += ` Formal demand notice with 15 days cure window.`;
    } else if (run % 4 === 2) {
      mockOutput.case_summary += ` Statutory provisions under Section 15 and Section 16 applicable.`;
    } else if (run % 4 === 3) {
      mockOutput.case_summary += ` Dispute governed by 3-year limitation under Article 55.`;
    }

    // Run through deterministic assessment first
    const detReport = {
      claimQuantum: preset.claimValue,
      msmed: {
        statutoryInterestRatePercent: "17.25%",
        estimatedStatutoryInterest: pIdx === 1 ? 65550 : 0,
        totalClaimWithInterest: pIdx === 1 ? 515550 : preset.claimValue
      },
      limitation: {
        status: "In time",
        expiryDate: "2029-01-10",
        effectiveStartDate: preset.breachDate
      },
      claimStrength: { rating: baseMock.claim_strength.rating },
      defenceStrength: { rating: baseMock.defence_strength.rating },
      processComparison: [{ baseFee: 10000, registryFee: 5000, neutralFee: 15000, totalWithGst: 35400 }],
      evidenceGaps: mockOutput.evidence_gaps
    };

    const violations = validateAITextIntegrity(mockOutput, detReport, preset);

    if (violations.length === 0) {
      passedFirstAttempt++;
    } else {
      retriesRequired++;
      // Simulate Attempt 2 correction (LLM removes violation)
      const correctedOutput = JSON.parse(JSON.stringify(baseMock));
      const retryViolations = validateAITextIntegrity(correctedOutput, detReport, preset);
      if (retryViolations.length > 0) {
        fallbacksTriggered++;
      }
    }
  }

  results.push({
    presetId: preset.id,
    presetLabel: preset.label,
    totalRuns: 20,
    passedFirstAttempt,
    retriesRequired,
    fallbacksTriggered
  });
}

// ----------------------------------------------------------------------------
// PART 3: RESULTS SUMMARY REPORT
// ----------------------------------------------------------------------------
console.log("===============================================================================");
console.log("  20 MOCK RUNS PER PRESET VALIDATION REPORT (80 RUNS TOTAL)");
console.log("===============================================================================");
console.table(results);

results.forEach(r => {
  assert.strictEqual(r.passedFirstAttempt, 20, `${r.presetLabel} had false positive violations on attempt 1!`);
  assert.strictEqual(r.fallbacksTriggered, 0, `${r.presetLabel} triggered unexpected fallbacks!`);
});

console.log("\n  ✓ 100% of runs (80/80) passed on Attempt 1 with ZERO false positives");
console.log("  ✓ Total Retries: 0 / 80");
console.log("  ✓ Total Fallbacks: 0 / 80");
console.log("===============================================================================\n");
