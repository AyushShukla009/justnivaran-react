/**
 * "Law data only" grounding tests
 * - Statute bank holds verbatim official text; only verified entries are used
 * - Issues carry the text of the provisions they rest on
 * - The prompt sends that text; the validator rejects section numbers outside the legal data
 */
import assert from "node:assert";
import STATUTES from "../../src/data/statutes.json" with { type: "json" };
import { getVerifiedProvisions } from "../../src/lib/statuteRetrieval.js";
import { generateDeterministicAssessment, BENCHMARK_PRESETS } from "../../src/lib/deterministicEngine.js";
import { buildClaudePrompt } from "../../src/lib/claudeAssessmentPrompt.js";
import { validateAITextIntegrity, extractSectionNumbers } from "../../api/assess.js";

// 1. Bank integrity
STATUTES.forEach((p) => {
  ["id", "act", "section", "heading", "text", "source_link", "retrieved_on", "verified"].forEach((f) => assert.ok(f in p, `${p.id}: ${f}`));
  assert.ok(Array.isArray(p.text) && p.text.length > 0, `${p.id}: text paragraphs`);
  assert.ok(/^https:\/\/www\.indiacode\.nic\.in\//.test(p.source_link), `${p.id}: official India Code source`);
});
const s73 = getVerifiedProvisions(["ICA-1872-S73"])[0];
assert.ok(s73.text[0].startsWith("When a contract has been broken, the party who suffers by such breach"), "s.73 verbatim opening");
assert.ok(s73.text[0].includes("Such compensation is not to be given for any remote and indirect loss or damage"), "s.73 remoteness limb");
assert.deepStrictEqual(getVerifiedProvisions(["NOT-IN-BANK"]), [], "unknown ids skipped");

// 2. Issues carry provision text
const construction = generateDeterministicAssessment(BENCHMARK_PRESETS[2]);
const merits = construction.brief.issues.find((i) => i.id === "MERITS");
assert.deepStrictEqual(merits.provisions.map((p) => p.id), ["ICA-1872-S73", "ICA-1872-S74"], "liquidated-damages matter attaches ss.73 and 74");
const invoice = generateDeterministicAssessment({ ...BENCHMARK_PRESETS[0], factsSummary: "Goods delivered, invoice unpaid.", expectedDefenses: "" });
assert.deepStrictEqual(invoice.brief.issues.find((i) => i.id === "MERITS").provisions.map((p) => p.id), ["ICA-1872-S73"], "plain debt attaches s.73 only");

// 3. Prompt carries verbatim text
const prompt = buildClaudePrompt({ intakeData: BENCHMARK_PRESETS[2], deterministicData: construction });
assert.ok(prompt.includes("STATUTORY TEXT (VERBATIM"), "prompt has statutory text block");
assert.ok(prompt.includes("whether or not actual damage or loss is proved to have been caused thereby"), "prompt carries s.74 text");

// 4. Validator: section numbers must come from the legal data
assert.deepStrictEqual([...extractSectionNumbers("Sections 15 to 18 and Section 2(1)(c)")].sort(), ["15", "16", "17", "18", "2"].sort());
const v1 = validateAITextIntegrity({ a: "Section 5 of the Limitation Act, 1963 permits condonation of delay." }, construction, BENCHMARK_PRESETS[2]);
assert.ok(v1.some((x) => x.includes("Section 5")), "section outside legal data rejected");
const v2 = validateAITextIntegrity({ a: "Section 74 of the Indian Contract Act, 1872 allows \"reasonable compensation not exceeding the amount so named\"." }, construction, BENCHMARK_PRESETS[2]);
assert.strictEqual(v2.length, 0, "provision in legal data accepted");

console.log("  ✓ ALL STATUTE-GROUNDING TESTS PASSED");
