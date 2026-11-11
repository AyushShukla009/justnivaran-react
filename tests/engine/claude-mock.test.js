/**
 * Claude pipeline test (mocked provider) — Neutral Case Brief v2
 * Location: tests/engine/claude-mock.test.js
 *
 * Runs the REAL executeAssessment() with ANTHROPIC_API_KEY set and the network
 * stubbed to return scripted model replies. Verifies:
 * 1. Compliant brief → live AI report; engine fields locked; no prediction fields.
 * 2. Prediction language → one corrective retry, then accepted when compliant.
 * 3. Prediction language twice → falls back to the rules engine.
 * 4. Validator: %, invented rupees, invented dates, unverified cases, predictions.
 * 5. Fallback labelling.
 */

import assert from "node:assert";
import { executeAssessment, validateAITextIntegrity } from "../../api/assess.js";
import { BENCHMARK_PRESETS, generateDeterministicAssessment } from "../../src/lib/deterministicEngine.js";
import { TEST_VERIFIED_PRECEDENTS } from "./fixtures/verifiedPrecedents.fixture.js";
import { compliantAIBrief } from "./fixtures/aiBrief.fixture.js";

const FIXED_TODAY = new Date("2026-10-27T00:00:00Z");
const PREDICTION_FIELDS = ["claimStrength", "defenceStrength", "settlementOutlook", "likelyOutcomeScenarios", "confidence"];

console.log("\n===============================================================================");
console.log("  CLAUDE PIPELINE (MOCKED PROVIDER) — NEUTRAL CASE BRIEF v2");
console.log("===============================================================================\n");

// ---------------------------------------------------------------------------
// Scripted provider
// ---------------------------------------------------------------------------
const realFetch = globalThis.fetch;
let scripted = [];
let calls = 0;
function anthropicReply(obj) {
  return new Response(
    JSON.stringify({
      id: "msg_test",
      type: "message",
      role: "assistant",
      model: "claude-sonnet-5-5",
      content: [{ type: "text", text: typeof obj === "string" ? obj : JSON.stringify(obj) }],
      stop_reason: "end_turn",
      stop_sequence: null,
      usage: { input_tokens: 1, output_tokens: 1 }
    }),
    { status: 200, headers: { "content-type": "application/json", "request-id": "req_test" } }
  );
}
globalThis.fetch = async () => {
  calls++;
  const next = scripted.shift();
  if (!next) throw new Error("No scripted reply");
  return anthropicReply(next);
};
process.env.ANTHROPIC_API_KEY = "test-key";

async function run(preset, replies) {
  scripted = [...replies];
  calls = 0;
  const res = await executeAssessment({ ...preset, asOfDate: FIXED_TODAY });
  return { res, calls };
}

// ---------------------------------------------------------------------------
// TEST 1: compliant brief is accepted and engine fields stay locked
// ---------------------------------------------------------------------------
for (const preset of BENCHMARK_PRESETS) {
  const det = generateDeterministicAssessment({ ...preset, asOfDate: FIXED_TODAY });
  const { res, calls: n } = await run(preset, [compliantAIBrief(det)]);
  const d = res.data;
  assert.strictEqual(n, 1, `${preset.label}: one provider call`);
  assert.strictEqual(d.isLiveAI, true, `${preset.label}: live AI report`);
  assert.ok(d.requestId.startsWith("JN-AI-"));
  assert.deepStrictEqual(d.limitation, det.limitation, "limitation locked to engine");
  assert.deepStrictEqual(d.section12A, det.section12A, "Section 12A locked to engine");
  assert.deepStrictEqual(d.msmed, det.msmed, "MSMED locked to engine");
  PREDICTION_FIELDS.forEach((k) => assert.ok(!(k in d), `${preset.label}: no ${k}`));
  assert.strictEqual(d.brief.issues.length, det.brief.issues.length, "every framed issue kept");
  d.brief.issues.forEach((i) => {
    assert.ok(i.analysis && i.analysis.length > 20, `analysis present for ${i.id}`);
    assert.strictEqual(i.finding, det.brief.issues.find((x) => x.id === i.id).finding, `engine finding locked for ${i.id}`);
  });
  assert.ok(d.brief.statementOfFacts.includes("respondent has not been heard"));
  console.log(`  ✓ ${preset.label}: compliant brief accepted, engine findings locked`);
}

// ---------------------------------------------------------------------------
// TEST 2: prediction language triggers one corrective retry
// ---------------------------------------------------------------------------
{
  const preset = BENCHMARK_PRESETS[1];
  const det = generateDeterministicAssessment({ ...preset, asOfDate: FIXED_TODAY });
  const predictive = compliantAIBrief(det, { statement_of_facts: "The claimant has a strong case and is likely to succeed on the stated facts." });
  const { res, calls: n } = await run(preset, [predictive, compliantAIBrief(det)]);
  assert.strictEqual(n, 2, "retried once");
  assert.strictEqual(res.data.isLiveAI, true, "accepted after correction");
  console.log("  ✓ Prediction language rejected, corrected on retry");
}

// ---------------------------------------------------------------------------
// TEST 3: persistent prediction language falls back to rules engine
// ---------------------------------------------------------------------------
{
  const preset = BENCHMARK_PRESETS[0];
  const det = generateDeterministicAssessment({ ...preset, asOfDate: FIXED_TODAY });
  const predictive = compliantAIBrief(det, { statement_of_facts: "Full recovery is likely and the respondent's defence is weak on these facts." });
  const { res } = await run(preset, [predictive, predictive]);
  assert.strictEqual(res.data.isLiveAI, false, "fell back");
  assert.strictEqual(res.data.engineType, "Rules-engine assessment");
  PREDICTION_FIELDS.forEach((k) => assert.ok(!(k in res.data), `fallback has no ${k}`));
  console.log("  ✓ Persistent prediction language → rules-engine fallback");
}

// ---------------------------------------------------------------------------
// TEST 3b: AI may not alter engine dates
// ---------------------------------------------------------------------------
{
  const preset = BENCHMARK_PRESETS[1];
  const det = generateDeterministicAssessment({ ...preset, asOfDate: FIXED_TODAY });
  const badDate = compliantAIBrief(det, { statement_of_facts: "The claimant states that limitation expired on 2027-03-31 according to its own reading." });
  const { res } = await run(preset, [badDate, badDate]);
  assert.strictEqual(res.data.isLiveAI, false, "invented date rejected → fallback");
  console.log("  ✓ Invented date rejected");
}

globalThis.fetch = realFetch;
delete process.env.ANTHROPIC_API_KEY;

// ---------------------------------------------------------------------------
// TEST 4: validator unit checks
// ---------------------------------------------------------------------------
const baseline = {
  claimQuantum: 450000,
  msmed: { estimatedStatutoryInterest: 65550, totalClaimWithInterest: 515550 },
  limitation: { expiryDate: "2029-01-10", effectiveStartDate: "2026-01-10" },
  processComparison: [{ baseFee: 10000, registryFee: 5000, neutralFee: 15000, totalWithGst: 35400 }],
  relatedPrecedents: TEST_VERIFIED_PRECEDENTS
};
const intake = { claimValue: 450000, breachDate: "2026-01-10" };
const has = (v, s) => v.some((x) => x.includes(s));

assert.ok(has(validateAITextIntegrity({ a: "High 75% chance of recovery." }, baseline, intake), "75%"));
assert.ok(has(validateAITextIntegrity({ a: "Settlement proposed at ₹ 88,00,000." }, baseline, intake), "unauthorized monetary amount"));
assert.ok(has(validateAITextIntegrity({ a: "Meeting occurred on 2032-12-25." }, baseline, intake), "unauthorized date"));
assert.ok(has(validateAITextIntegrity({ a: "Per judgment in Reliance Industries v. Union of India." }, baseline, intake), "unauthorized case"));
console.log("  ✓ %, invented rupees, invented dates and unlisted cases rejected");

const cites = { a: "See Patil Automation Pvt. Ltd. & Ors. v. Rakheja Engineers Pvt. Ltd. (2022) 10 SCC 1 on Section 12A." };
assert.strictEqual(validateAITextIntegrity(cites, baseline, intake).length, 0, "verified retrieved case may be cited");
assert.ok(has(validateAITextIntegrity(cites, { ...baseline, relatedPrecedents: [] }, intake), "unauthorized"), "not retrieved → rejected");
assert.ok(
  has(validateAITextIntegrity(cites, { ...baseline, relatedPrecedents: TEST_VERIFIED_PRECEDENTS.map((c) => ({ ...c, verified: false })) }, intake), "unauthorized"),
  "retrieved but unverified → rejected"
);
console.log("  ✓ Citations allowed only when retrieved AND verified (Task 17)");

const predictive = [
  "The claimant is likely to succeed.",
  "The respondent has a weak defence.",
  "Chances of success are good.",
  "Partial recovery likely on these facts.",
  "There is a high likelihood that the award will be in favour of the claimant.",
  "The claim would succeed if proved."
];
predictive.forEach((t) => assert.ok(has(validateAITextIntegrity({ a: t }, baseline, intake), "outcome-prediction"), `must reject: ${t}`));
const neutral = [
  "The issue turns on whether the delivery challan bears the respondent's acknowledgment.",
  "Section 74 of the Indian Contract Act, 1872 governs stipulated damages; its application depends on proof of the clause.",
  "The respondent's position is not on record."
];
neutral.forEach((t) => assert.strictEqual(validateAITextIntegrity({ a: t }, baseline, intake).length, 0, `false positive on: ${t}`));
console.log("  ✓ Outcome-prediction language rejected; neutral analysis passes");

// ---------------------------------------------------------------------------
// TEST 5: fallback labelling
// ---------------------------------------------------------------------------
const fb = await executeAssessment({ ...BENCHMARK_PRESETS[1], asOfDate: FIXED_TODAY }, { forceFallback: true });
assert.ok(fb.data.requestId.startsWith("JN-RULES-"));
assert.strictEqual(fb.data.engineType, "Rules-engine assessment");
assert.strictEqual(fb.data.isLiveAI, false);
console.log("  ✓ Fallback labelled 'Rules-engine assessment'");

console.log("\n===============================================================================");
console.log("  ALL CHECKS PASSED CLEANLY (Zero Errors)");
console.log("===============================================================================\n");
