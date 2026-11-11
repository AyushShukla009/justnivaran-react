/**
 * Task 17: Case-bank retrieval layer tests
 * - Only cases retrieved for the request AND verified: true become relatedPrecedents
 * - Shipped sample entries are all verified: false, so nothing is shown by default
 * - No external calls are made (pure local data)
 */
import assert from "node:assert";
import { retrieveCases } from "../../src/lib/caseRetrieval.js";
import { generateDeterministicAssessment, BENCHMARK_PRESETS } from "../../src/lib/deterministicEngine.js";
import CASE_BANK from "../../src/data/cases.json" with { type: "json" };

// 1. Shipped bank: 5 samples, all unverified, all clearly marked
assert.strictEqual(CASE_BANK.length, 5, "cases.json ships 5 sample entries");
CASE_BANK.forEach((c) => {
  assert.strictEqual(c.verified, false, `sample must be verified:false: ${c.citation}`);
  assert.ok(/SAMPLE/.test(c.citation), `sample must be clearly marked: ${c.citation}`);
  ["citation", "court", "year", "subject", "holding", "source_link", "verified"].forEach((f) =>
    assert.ok(f in c, `field ${f} present`)
  );
});

// 2. Samples are retrieved for matching facts but never surface as relatedPrecedents
const msme = retrieveCases({ category: "MSME Delayed Payments (MSMED Act 2006)", factsSummary: "unpaid invoice, Udyam registered supplier" });
assert.ok(msme.retrieved.length > 0, "relevant samples are retrieved");
assert.strictEqual(msme.relatedPrecedents.length, 0, "unverified samples are not related precedents");

// 3. Every benchmark preset report has an empty relatedPrecedents list with the shipped bank
BENCHMARK_PRESETS.forEach((p) => {
  const r = generateDeterministicAssessment(p);
  assert.ok(Array.isArray(r.relatedPrecedents), "relatedPrecedents is an array");
  assert.strictEqual(r.relatedPrecedents.length, 0, `${p.label}: nothing shown when none verified`);
});

// 4. A verified + relevant case is returned; a verified but irrelevant case is not
const bank = [
  { citation: "Test A v. Test B", court: "T", year: 2020, subject: "construction delay; liquidated damages", holding: "h", source_link: "https://example.com/a", verified: true },
  { citation: "Test C v. Test D", court: "T", year: 2020, subject: "trademark; passing off", holding: "h", source_link: "https://example.com/c", verified: true },
  { citation: "Test E v. Test F", court: "T", year: 2020, subject: "construction delay", holding: "h", source_link: "javascript:alert(1)", verified: false }
];
const r = retrieveCases({ category: "Construction, EPC & Infrastructure Delays", factsSummary: "liquidated damages deducted for delay" }, bank);
assert.deepStrictEqual(r.relatedPrecedents.map((c) => c.citation), ["Test A v. Test B"], "only retrieved AND verified");
assert.ok(r.retrieved.some((c) => c.citation === "Test E v. Test F"), "unverified relevant case is retrieved");
assert.strictEqual(r.retrieved.find((c) => c.citation === "Test E v. Test F").source_link, "", "non-http links are dropped");

// 5. Empty intake retrieves nothing
assert.strictEqual(retrieveCases({}, bank).retrieved.length, 0, "empty query retrieves nothing");

console.log("  ✓ ALL CASE-RETRIEVAL TESTS PASSED");
