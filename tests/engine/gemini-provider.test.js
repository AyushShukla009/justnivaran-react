/**
 * Gemini provider (free-tier option): same prompt, same checks, same fallback as Claude.
 * Runs the real executeAssessment() with only GEMINI_API_KEY set and a simulated Gemini server.
 */
import assert from "node:assert";
import { executeAssessment, pickAIProvider } from "../../api/assess.js";
import { BENCHMARK_PRESETS, generateDeterministicAssessment } from "../../src/lib/deterministicEngine.js";
import { compliantAIBrief } from "./fixtures/aiBrief.fixture.js";

const asOfDate = new Date("2026-11-12T00:00:00Z");
delete process.env.ANTHROPIC_API_KEY;
process.env.GEMINI_API_KEY = "test-gemini-key";
process.env.GEMINI_MODEL = "gemini-test-model";

assert.strictEqual(pickAIProvider().name, "gemini", "Gemini used when only its key is set");

const realFetch = globalThis.fetch;
let scripted = [];
const bodies = [];
globalThis.fetch = async (url, init) => {
  bodies.push({ url: String(url), body: JSON.parse(init?.body || "{}") });
  const next = scripted.shift();
  return new Response(JSON.stringify({
    candidates: [{ content: { role: "model", parts: [{ text: JSON.stringify(next) }] }, finishReason: "STOP", index: 0 }],
    usageMetadata: { promptTokenCount: 1, candidatesTokenCount: 1, totalTokenCount: 2 }
  }), { status: 200, headers: { "content-type": "application/json" } });
};

// 1. Compliant answer → live AI brief labelled Gemini, engine findings locked
const preset = BENCHMARK_PRESETS[1];
const det = generateDeterministicAssessment({ ...preset, asOfDate });
scripted = [compliantAIBrief(det)];
let res = await executeAssessment({ ...preset, asOfDate });
assert.strictEqual(res.data.isLiveAI, true);
assert.strictEqual(res.data.engineType, "AI-assisted assessment (Gemini)");
assert.deepStrictEqual(res.data.limitation, det.limitation, "engine findings locked");
assert.ok(res.data.brief.issues.every((i) => i.analysis), "analysis filled for every issue");
const req = bodies[0];
assert.ok(req.url.includes("gemini-test-model"), "uses GEMINI_MODEL");
const cfg = req.body.generationConfig || {};
assert.ok(JSON.stringify(req.body).includes("NEUTRAL CASE BRIEF"), "same system prompt");
assert.strictEqual(cfg.responseMimeType, "application/json", "JSON output requested");
console.log("  ✓ Gemini: compliant brief accepted, labelled, engine findings locked");

// 2. Prediction language → retry carries the exact reason → corrected answer accepted
bodies.length = 0;
scripted = [compliantAIBrief(det, { statement_of_facts: "The claimant has a strong case and is likely to succeed." }), compliantAIBrief(det)];
res = await executeAssessment({ ...preset, asOfDate });
assert.strictEqual(res.data.isLiveAI, true, "accepted after correction");
assert.strictEqual(bodies.length, 2, "one retry");
assert.ok(JSON.stringify(bodies[1].body).includes("outcome-prediction language"), "retry tells the model what was wrong");
console.log("  ✓ Retry includes the validation reasons; corrected answer accepted");

// 3. Twice non-compliant → rules engine
scripted = [compliantAIBrief(det, { statement_of_facts: "Full recovery is likely on these facts and the defence is weak." }), compliantAIBrief(det, { statement_of_facts: "Full recovery is likely on these facts and the defence is weak." })];
res = await executeAssessment({ ...preset, asOfDate });
assert.strictEqual(res.data.isLiveAI, false);
assert.strictEqual(res.data.engineType, "Rules-engine assessment");
console.log("  ✓ Persistent violations fall back to the rules engine");

globalThis.fetch = realFetch;
delete process.env.GEMINI_API_KEY;
delete process.env.GEMINI_MODEL;
console.log("  ✓ ALL GEMINI PROVIDER TESTS PASSED");
