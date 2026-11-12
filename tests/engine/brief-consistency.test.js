/**
 * Brief consistency: the statutory checks and the procedural route must never contradict each other,
 * and limitation wording must say where the period runs from.
 */
import assert from "node:assert";
import { generateDeterministicAssessment, BENCHMARK_PRESETS } from "../../src/lib/deterministicEngine.js";

const asOfDate = new Date("2026-11-12T00:00:00Z");

// 1. Below the specified value with no arbitration clause: Section 12A must not be the route
const small = generateDeterministicAssessment({ category: "Commercial Contract & Supply Default", claimValue: 150000, breachDate: "2026-05-01", arbitrationClauseStatus: "No", hasArbitrationClause: false, factsSummary: "Small unpaid invoice.", evidenceList: ["invoices"], asOfDate });
assert.ok(!/Mandatory Pre-Institution/i.test(small.brief.procedure.route), "small claim must not be routed to s.12A mediation");
assert.ok(/does not apply/i.test(small.brief.procedure.basis), "small claim route explains s.12A does not apply");
assert.ok(!small.brief.issues.some((i) => i.id === "SECTION_12A"), "no s.12A issue framed for a small claim");

// 2. Written acknowledgment: limitation detail must say the period runs from it
const construction = generateDeterministicAssessment({ ...BENCHMARK_PRESETS[2], asOfDate });
const lim = construction.brief.statutoryChecks.find((c) => c.key === "limitation");
assert.ok(/written acknowledgment dated/i.test(lim.detail) && /Section 18/.test(lim.detail), "acknowledgment reset is explained");

// 3. Barred claim says "expired", never "0 days remaining"
const barred = generateDeterministicAssessment({ category: "Commercial Contract & Supply Default", claimValue: 500000, breachDate: "2022-06-01", factsSummary: "Old invoice.", evidenceList: ["invoices"], asOfDate });
const bl = barred.brief.statutoryChecks.find((c) => c.key === "limitation");
assert.ok(/expired on/.test(bl.detail) && !/0 days remaining/.test(bl.detail), "barred wording");
assert.ok(!/immediate threshold dismissal/i.test(barred.brief.procedure.note), "no categorical dismissal language");

// 4. Every preset: route basis never cites s.12A when the s.12A check says it is not required
for (const p of BENCHMARK_PRESETS) {
  const r = generateDeterministicAssessment({ ...p, asOfDate });
  const s12 = r.brief.statutoryChecks.find((c) => c.key === "section12A");
  if (s12 && /Not Required|Below Specified/i.test(s12.result)) {
    assert.ok(!/^Mandatory Pre-Institution/i.test(r.brief.procedure.route), `${p.label}: route consistent with s.12A check`);
  }
  // no outcome or loaded language in the engine's own wording (parties' quoted words are left as written)
  const engineText = JSON.stringify({
    checks: r.brief.statutoryChecks,
    findings: r.brief.issues.map((i) => [i.title, i.finding, i.applicableLaw]),
    procedure: r.brief.procedure
  });
  assert.ok(!/likely to succeed|strong case|weak case|recovery likely|penal compound/i.test(engineText), `${p.label}: neutral wording`);
}

console.log("  ✓ ALL BRIEF-CONSISTENCY TESTS PASSED");
