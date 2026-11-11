/**
 * Task 16: guidance-only predictor categories
 * (Family / Matrimonial, Non-commercial civil, Miscellaneous)
 */
import assert from "node:assert";
import fs from "node:fs";
import { GUIDANCE_MODULES, isGuidanceCategory } from "../../src/lib/categories/index.js";
import { TO_BE_PROVIDED } from "../../src/lib/categories/guidanceShared.js";
import { generateDeterministicAssessment, BENCHMARK_PRESETS } from "../../src/lib/deterministicEngine.js";
import { executeAssessment } from "../../api/assess.js";

const FORBIDDEN_KEYS = [
  "claimStrength", "defenceStrength", "likelyOutcomeScenarios", "settlementOutlook",
  "processComparison", "msmed", "section12A", "limitation", "claimQuantum", "forumRecommendation"
];
const FORBIDDEN_TEXT = /MSMED|12A|Commercial Courts|Limitation Act|recovery likely|likelihood/i;

function completeAnswers(mod) {
  const a = { category: mod.category };
  mod.fields.forEach((f) => {
    a[f.name] = f.type === "select" ? f.options[0].value : "Short anonymised note.";
  });
  return a;
}

assert.strictEqual(GUIDANCE_MODULES.length, 3, "three guidance modules");

for (const mod of GUIDANCE_MODULES) {
  // Own intake fields + validation
  assert.ok(mod.fields.length >= 4, `${mod.label}: has its own intake fields`);
  assert.ok(mod.validate({}).length > 0, `${mod.label}: empty intake rejected`);
  const answers = completeAnswers(mod);
  assert.strictEqual(mod.validate(answers), "", `${mod.label}: complete intake accepted`);
  assert.ok(mod.validate({ ...answers, [mod.fields[0].name]: "not-an-option" }).length > 0, `${mod.label}: bad option rejected`);

  // Own rules module, guidance-only output
  const r = mod.generateGuidance(answers);
  assert.strictEqual(r.reportType, "guidance");
  assert.strictEqual(r.isLiveAI, false);
  FORBIDDEN_KEYS.forEach((k) => assert.ok(!(k in r), `${mod.label}: report must not contain ${k}`));
  assert.ok(!FORBIDDEN_TEXT.test(JSON.stringify(r)), `${mod.label}: no commercial rules or predictions in output`);
  r.sections.forEach((s) => assert.deepStrictEqual(s.items, [TO_BE_PROVIDED], `${mod.label}/${s.key}: rule content is [to be provided]`));

  // Source does not reuse commercial rules
  const src = fs.readFileSync(new URL(`../../src/lib/categories/${{ "Family / Matrimonial": "familyMatrimonial", "Non-commercial civil": "nonCommercialCivil", "Miscellaneous": "miscellaneous" }[mod.label]}.js`, import.meta.url), "utf8");
  const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  assert.ok(!/deterministicEngine|calculateLimitation|checkMSMEDApplicability|checkSection12A|MSMED|12A/.test(code), `${mod.label}: no commercial rules in code`);

  // Engine dispatch
  assert.ok(isGuidanceCategory(mod.category));
  assert.strictEqual(generateDeterministicAssessment(answers).reportType, "guidance", `${mod.label}: engine dispatches to module`);
}

// Family: required sections and safety notice
const family = GUIDANCE_MODULES.find((m) => m.label === "Family / Matrimonial");
const famReport = family.generateGuidance({ ...completeAnswers(family), safetyConcern: "yes" });
assert.deepStrictEqual(famReport.sections.map((s) => s.key), ["forum", "documents", "whatToExpect", "mediationCounselling"]);
assert.ok(famReport.notices.some((n) => n.includes("112")), "safety notice shown when someone is at risk");
assert.strictEqual(family.generateGuidance({ ...completeAnswers(family), safetyConcern: "no" }).notices.length, 0);

// Commercial categories unaffected
BENCHMARK_PRESETS.forEach((p) => {
  const r = generateDeterministicAssessment(p);
  assert.ok(r.brief && r.limitation && r.section12A, `${p.label}: commercial report still built by the rules engine`);
});

// Server never calls the AI provider for guidance categories, even with a key configured
process.env.ANTHROPIC_API_KEY = "test-key-should-not-be-used";
let networkCalls = 0;
const realFetch = globalThis.fetch;
globalThis.fetch = async () => { networkCalls++; throw new Error("network blocked in test"); };
for (const mod of GUIDANCE_MODULES) {
  const res = await executeAssessment(completeAnswers(mod));
  assert.strictEqual(res.data.reportType, "guidance");
}
globalThis.fetch = realFetch;
delete process.env.ANTHROPIC_API_KEY;
assert.strictEqual(networkCalls, 0, "no AI/network call for guidance categories");

console.log("  ✓ ALL TASK 16 CATEGORY-MODULE TESTS PASSED");
