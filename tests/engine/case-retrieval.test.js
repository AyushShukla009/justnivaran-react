/**
 * Case-Bank Retrieval Layer Tests (Indian Kanoon Integration)
 * - Shipped cases in cases.json are verified landmark precedents with canonical Indian Kanoon URLs
 * - Only cases retrieved for the request AND verified: true become relatedPrecedents
 * - Retrieval covers Commercial, MSME, Arbitration, Matrimonial/Divorce, Non-commercial civil, and Miscellaneous
 * - No external calls are made (pure local data)
 */
import assert from "node:assert";
import { retrieveCases } from "../../src/lib/caseRetrieval.js";
import { generateDeterministicAssessment, BENCHMARK_PRESETS } from "../../src/lib/deterministicEngine.js";
import CASE_BANK from "../../src/data/cases.json" with { type: "json" };

// 1. Shipped bank: verified landmark Supreme Court & High Court cases with Indian Kanoon links
assert.ok(CASE_BANK.length >= 18, `cases.json ships at least 18 verified cases (found ${CASE_BANK.length})`);
CASE_BANK.forEach((c) => {
  assert.strictEqual(c.verified, true, `case must be verified:true: ${c.citation}`);
  assert.ok(typeof c.citation === "string" && c.citation.trim(), `valid citation: ${c.citation}`);
  assert.ok(typeof c.court === "string" && c.court.trim(), `valid court: ${c.citation}`);
  assert.ok(typeof c.year === "number" && c.year >= 1950, `valid year: ${c.citation}`);
  assert.ok(typeof c.subject === "string" && c.subject.trim(), `valid subject: ${c.citation}`);
  assert.ok(typeof c.holding === "string" && c.holding.trim(), `valid holding: ${c.citation}`);
  assert.ok(
    typeof c.source_link === "string" && c.source_link.startsWith("https://indiankanoon.org/doc/"),
    `source_link must be canonical Indian Kanoon URL: ${c.citation} -> ${c.source_link}`
  );
  assert.ok(typeof c.bench === "string" && c.bench.trim(), `valid bench: ${c.citation}`);
  assert.ok(typeof c.decided_on === "string" && /^\d{4}-\d{2}-\d{2}$/.test(c.decided_on), `valid decided_on date: ${c.citation}`);
  assert.ok(typeof c.headnote === "string" && c.headnote.trim(), `valid headnote: ${c.citation}`);
  if (c.equivalent_citations) {
    assert.ok(Array.isArray(c.equivalent_citations), `equivalent_citations array: ${c.citation}`);
  }
});

// 2. Precedent retrieval: MSME queries retrieve verified MSME precedents with Indian Kanoon links
const msme = retrieveCases({
  category: "MSME Delayed Payments (MSMED Act 2006)",
  factsSummary: "unpaid invoice, Udyam registered supplier statutory interest"
});
assert.ok(msme.retrieved.length > 0, "relevant MSME cases are retrieved");
assert.ok(msme.relatedPrecedents.length > 0, "verified MSME cases are returned as relatedPrecedents");
assert.ok(
  msme.relatedPrecedents.some((c) => c.citation.includes("Silpi Industries") || c.citation.includes("Mahakali Foods")),
  "retrieves landmark MSME precedent (Silpi Industries or Mahakali Foods)"
);
msme.relatedPrecedents.forEach((c) => {
  assert.strictEqual(c.verified, true);
  assert.ok(c.source_link.startsWith("https://indiankanoon.org/doc/"));
});

// 3. Precedent retrieval: Commercial contract / liquidated damages / delay
const comm = retrieveCases({
  category: "Commercial Contracts & Vendor Non-Performance",
  factsSummary: "liquidated damages breach of contract delay pre-estimate of loss Section 74"
});
assert.ok(comm.relatedPrecedents.length > 0, "verified contract precedents returned");
assert.ok(
  comm.relatedPrecedents.some((c) => c.citation.includes("Saw Pipes") || c.citation.includes("Kailash Nath")),
  "retrieves landmark Section 74 damages precedent (Saw Pipes or Kailash Nath)"
);

// 4. Precedent retrieval: Matrimonial / Divorce mutual consent cooling off
const divorce = retrieveCases({
  category: "Family / Matrimonial (including divorce)",
  factsSummary: "divorce mutual consent six month cooling off period waiver settlement Section 13B"
});
assert.ok(divorce.relatedPrecedents.length > 0, "verified matrimonial precedents returned");
assert.ok(
  divorce.relatedPrecedents.some((c) => c.citation.includes("Amardeep Singh")),
  "retrieves landmark mutual consent cooling-off waiver precedent (Amardeep Singh)"
);

// 5. Precedent retrieval: Non-commercial civil / Cheque bounce / 138 NI Act
const cheque = retrieveCases({
  category: "Non-commercial civil",
  factsSummary: "cheque bounce Section 138 Negotiable Instruments Act digital payment online settlement"
});
assert.ok(cheque.relatedPrecedents.length > 0, "verified NI Act precedents returned");
assert.ok(
  cheque.relatedPrecedents.some((c) => c.citation.includes("Meters and Instruments")),
  "retrieves Meters and Instruments for digital compounding"
);

// 6. Precedent retrieval: Miscellaneous / ADR Section 89 CPC
const adr = retrieveCases({
  category: "Miscellaneous",
  factsSummary: "Section 89 CPC mediation conciliation civil procedure ADR"
});
assert.ok(adr.relatedPrecedents.length > 0, "verified ADR precedents returned");
assert.ok(
  adr.relatedPrecedents.some((c) => c.citation.includes("Afcons Infrastructure")),
  "retrieves Afcons Infrastructure for Section 89 CPC taxonomy"
);

// 7. Deterministic benchmark presets include verified precedents
BENCHMARK_PRESETS.forEach((p) => {
  const r = generateDeterministicAssessment(p);
  assert.ok(Array.isArray(r.relatedPrecedents), `${p.label}: relatedPrecedents is an array`);
  // All returned precedents must have verified: true and Indian Kanoon source_link
  r.relatedPrecedents.forEach((c) => {
    assert.strictEqual(c.verified, true);
    assert.ok(c.source_link.startsWith("https://indiankanoon.org/doc/"));
  });
});

// 8. Security & filtering logic on custom mock bank (unit tests for isolated rules)
const mockBank = [
  { citation: "Test A v. Test B", court: "T", year: 2020, subject: "construction delay; liquidated damages", holding: "h", source_link: "https://indiankanoon.org/doc/123/", verified: true },
  { citation: "Test C v. Test D", court: "T", year: 2020, subject: "trademark; passing off", holding: "h", source_link: "https://indiankanoon.org/doc/456/", verified: true },
  { citation: "Test E v. Test F", court: "T", year: 2020, subject: "construction delay", holding: "h", source_link: "javascript:alert(1)", verified: false }
];
const r = retrieveCases({ category: "Construction, EPC & Infrastructure Delays", factsSummary: "liquidated damages deducted for delay" }, mockBank);
assert.deepStrictEqual(r.relatedPrecedents.map((c) => c.citation), ["Test A v. Test B"], "only retrieved AND verified");
assert.ok(r.retrieved.some((c) => c.citation === "Test E v. Test F"), "unverified relevant case is retrieved");
assert.strictEqual(r.retrieved.find((c) => c.citation === "Test E v. Test F").source_link, "", "non-http links are dropped");

// 9. Empty intake retrieves nothing
assert.strictEqual(retrieveCases({}, mockBank).retrieved.length, 0, "empty query retrieves nothing");

console.log("  ✓ ALL CASE-RETRIEVAL (INDIAN KANOON) TESTS PASSED");
