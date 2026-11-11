/**
 * JustNivaran Institutional Legal Assessment Endpoint (/api/assess)
 *
 * Engine Architecture:
 * 1. Executes deterministic rules engine first (limitation, Sec 12A, MSMED, fee schedule, forum).
 * 2. Injects deterministic findings as IMMUTABLE ground truth into Claude Sonnet 5.5.
 * 3. Validates AI response strictly with Zod schema (with one retry on malformed JSON).
 * 4. Programmatically overwrites and locks all statutory parameters with deterministic facts.
 * 5. If ANTHROPIC_API_KEY is unset, slow (>12s), or fails, immediately returns authoritative
 *    deterministic report labelled strictly as "Rules-engine assessment".
 * 6. Zero logging of sensitive user case text.
 * 7. Rate limited and protected against prompt injection.
 */

import crypto from "crypto";
import Anthropic from "@anthropic-ai/sdk";
import { generateDeterministicAssessment } from "../src/lib/deterministicEngine.js";
import { getGuidanceModule } from "../src/lib/categories/index.js";
import { AIAssessmentResponseSchema } from "../src/lib/aiAssessmentSchema.js";
import {
  CLAUDE_SYSTEM_PROMPT,
  buildClaudePrompt,
  ALLOWED_STATUTORY_AUTHORITIES
} from "../src/lib/claudeAssessmentPrompt.js";

/**
 * Extract base section numbers referenced as "Section(s) …" (expands "15 to 18", "15–19").
 */
export function extractSectionNumbers(text) {
  const nums = new Set();
  const re = /\bSections?\s+((?:\d+[A-Z]{0,2}(?:\(\w+\))*\s*(?:,|and|&|to|–|-|or)?\s*)+)/g;
  let m;
  while ((m = re.exec(String(text || ""))) !== null) {
    const chunk = m[1].replace(/\(\w+\)/g, "");
    const rangeRe = /(\d+)\s*(?:to|–|-)\s*(\d+)/g;
    let r;
    while ((r = rangeRe.exec(chunk)) !== null) {
      const a = Number(r[1]);
      const b = Number(r[2]);
      if (b > a && b - a <= 30) for (let n = a; n <= b; n++) nums.add(String(n));
    }
    (chunk.match(/\d+[A-Z]{0,2}/g) || []).forEach((n) => nums.add(n));
  }
  return nums;
}

const BASE_ALLOWED_SECTIONS = extractSectionNumbers(ALLOWED_STATUTORY_AUTHORITIES.join(" \n "));

// Rate limiting configurations (Sliding window)
const memoryRateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 Hour
const isDemoMode = process.env.DEMO_MODE === "true" || process.env.DEMO_MODE === "1";
const MAX_REQUESTS_PER_WINDOW = isDemoMode
  ? 1000 // Raised limit for live presentations & bench demonstrations
  : (Number(process.env.AI_REQUESTS_PER_HOUR) || 10);
const MAX_TOTAL_INPUT_CHARS = 15000;
const CLAUDE_TIMEOUT_MS = 12000; // 12 seconds hard timeout

function getHashedClientId(req) {
  // Prefer the client IP set by the Vercel edge (not spoofable by the caller).
  // The User-Agent is deliberately NOT part of the key: changing it must not reset the quota.
  const ip =
    req.headers["x-real-ip"] ||
    req.headers["x-vercel-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "127.0.0.1";
  const secret = process.env.RATE_LIMIT_HMAC_SECRET || "justnivaran-hmac-secret-2026";

  return crypto.createHmac("sha256", secret).update(String(ip)).digest("hex");
}

function checkRateLimit(clientId) {
  const now = Date.now();
  const clientData = memoryRateLimitStore.get(clientId) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > clientData.resetTime) {
    clientData.count = 0;
    clientData.resetTime = now + RATE_LIMIT_WINDOW_MS;
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((clientData.resetTime - now) / 1000)
    };
  }

  clientData.count += 1;
  memoryRateLimitStore.set(clientId, clientData);
  return { allowed: true };
}

/**
 * Validate input character length without logging sensitive text
 */
function validateInputLength(payload) {
  let totalLength = 0;
  for (const [key, val] of Object.entries(payload || {})) {
    if (typeof val === "string") {
      totalLength += val.length;
    } else if (Array.isArray(val)) {
      totalLength += JSON.stringify(val).length;
    }
  }
  return totalLength <= MAX_TOTAL_INPUT_CHARS;
}

/**
 * Strip Markdown code blocks if present
 */
function cleanJsonOutput(text) {
  let clean = (text || "").trim();
  if (clean.startsWith("```json")) {
    clean = clean.slice(7);
  } else if (clean.startsWith("```")) {
    clean = clean.slice(3);
  }
  if (clean.endsWith("```")) {
    clean = clean.slice(0, -3);
  }
  return clean.trim();
}

/**
 * Post-Validation Security & Statutory Check:
 * Enforces User Directives:
 * 1. Prohibits "%" symbol anywhere in AI-generated text.
 * 2. Prohibits rupee figures not supplied by the engine (principal, statutory interest, total, fees).
 * 3. Prohibits dates not present in intake inputs or deterministic baseline.
 * 4. Forbids citing any case or party unless it was retrieved from the case bank for THIS
 *    request AND is marked verified: true (deterministicReport.relatedPrecedents).
 */
export function validateAITextIntegrity(aiData, deterministicReport, intakeData = {}) {
  const violations = [];

  const textValues = [];
  function collect(val) {
    if (typeof val === "string") {
      textValues.push(val);
    } else if (Array.isArray(val)) {
      val.forEach(collect);
    } else if (val && typeof val === "object") {
      Object.values(val).forEach(collect);
    }
  }
  collect(aiData);
  const fullText = textValues.join(" \n ");

  // 1. Percentage Symbol Validation:
  // - Allows the engine-supplied statutory interest rate string (e.g. "17.25%")
  // - Allows "75%" strictly in Section 19 / pre-deposit statutory context
  // - Allows "18%" strictly in GST / tax context
  // - Rejects all other percentages (probabilities, settlement odds, unauthorized rates)
  const engineRateRaw = deterministicReport.msmed?.statutoryInterestRatePercent || "";
  const engineRateNum = engineRateRaw.replace("%", "").trim();

  const pctPattern = /(?:([0-9]+(?:\.[0-9]+)?)\s*%)|%/g;
  let pctMatch;
  while ((pctMatch = pctPattern.exec(fullText)) !== null) {
    const num = pctMatch[1];
    const matchIdx = pctMatch.index;
    const windowStart = Math.max(0, matchIdx - 80);
    const windowEnd = Math.min(fullText.length, matchIdx + (pctMatch[0]?.length || 0) + 80);
    const surroundingContext = fullText.slice(windowStart, windowEnd).toLowerCase();

    // Condition A: Engine-supplied statutory interest rate (e.g. "17.25%")
    if (num && engineRateNum && (num === engineRateNum || parseFloat(num) === parseFloat(engineRateNum))) {
      continue;
    }

    // Condition B: "75%" strictly in Section 19 / pre-deposit context
    if (num && parseFloat(num) === 75 && /(?:section\s*19|pre-?deposit|deposit|msmed)/i.test(surroundingContext)) {
      continue;
    }

    // Condition C: "18%" strictly in GST / tax context
    if (num && parseFloat(num) === 18 && /(?:gst|goods and services tax|tax)/i.test(surroundingContext)) {
      continue;
    }

    violations.push(`AI generated prohibited percentage: "${pctMatch[0]}". No percentage scores, probabilities, or unapproved rates permitted.`);
  }

  // 2. Validate Rupee Amounts
  const allowedAmounts = new Set();
  const registerAmount = (amt) => {
    if (amt != null && !isNaN(Number(amt))) {
      const n = Math.round(Number(amt));
      if (n > 0) allowedAmounts.add(n);
    }
  };

  registerAmount(deterministicReport.claimQuantum);
  registerAmount(intakeData.claimValue);
  registerAmount(deterministicReport.msmed?.estimatedStatutoryInterest);
  registerAmount(deterministicReport.msmed?.totalClaimWithInterest);

  if (Array.isArray(deterministicReport.processComparison)) {
    deterministicReport.processComparison.forEach((p) => {
      registerAmount(p.baseFee);
      registerAmount(p.registryFee);
      registerAmount(p.neutralFee);
      registerAmount(p.totalWithGst);
    });
  }

  const rupeePattern = /(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d+)?)\s*(lakh|lac|crore|cr|k)?/gi;
  let match;
  while ((match = rupeePattern.exec(fullText)) !== null) {
    const rawDigits = match[1].replace(/,/g, "");
    const multiplier = match[2]?.toLowerCase();
    let val = parseFloat(rawDigits);
    if (multiplier === "lakh" || multiplier === "lac") val *= 100000;
    else if (multiplier === "crore" || multiplier === "cr") val *= 10000000;
    else if (multiplier === "k") val *= 1000;
    val = Math.round(val);

    if (val > 0 && !allowedAmounts.has(val)) {
      violations.push(`AI invented unauthorized monetary amount: "${match[0]}" (${val})`);
    }
  }

  const wordAmtPattern = /\b(\d+(?:\.\d+)?)\s*(lakh|lac|crore|cr)\b/gi;
  while ((match = wordAmtPattern.exec(fullText)) !== null) {
    const num = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    let val = num;
    if (unit === "lakh" || unit === "lac") val *= 100000;
    else if (unit === "crore" || unit === "cr") val *= 10000000;
    val = Math.round(val);

    if (val > 0 && !allowedAmounts.has(val)) {
      violations.push(`AI invented unauthorized monetary amount: "${match[0]}" (${val})`);
    }
  }

  // 3. Date Validation
  const authorizedDatesPool = [
    intakeData.breachDate,
    intakeData.acceptanceDate,
    intakeData.acknowledgmentDate,
    deterministicReport.limitation?.expiryDate,
    deterministicReport.limitation?.effectiveStartDate,
    deterministicReport.msmed?.appointedDay,
    "2020-03-15",
    "2022-02-28",
    "15.03.2020",
    "28.02.2022",
    intakeData.factsSummary,
    intakeData.factualChronology,
    deterministicReport.brief ? JSON.stringify(deterministicReport.brief) : ""
  ]
    .filter(Boolean)
    .join(" ");

  const isoDatePattern = /\b(\d{4}-\d{2}-\d{2})\b/g;
  while ((match = isoDatePattern.exec(fullText)) !== null) {
    const d = match[1];
    if (!authorizedDatesPool.includes(d)) {
      violations.push(`AI introduced unauthorized date: ${d}`);
    }
  }

  const verbalDatePattern = /\b\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}\b/gi;
  while ((match = verbalDatePattern.exec(fullText)) !== null) {
    const d = match[0];
    if (!authorizedDatesPool.toLowerCase().includes(d.toLowerCase())) {
      violations.push(`AI introduced unauthorized date: ${d}`);
    }
  }

  // 4. Case and Party Citation Check
  // Only precedents retrieved for this request AND marked verified: true may be cited.
  const verifiedPrecedents = (Array.isArray(deterministicReport.relatedPrecedents) ? deterministicReport.relatedPrecedents : [])
    .filter((c) => c && c.verified === true && typeof c.citation === "string");
  const normalize = (t) => String(t).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const allowedCitationsNorm = verifiedPrecedents.map((c) => normalize(c.citation));
  const allowedFirstParties = verifiedPrecedents
    .map((c) => normalize(String(c.citation).split(/\s+(?:v\.|vs\.?)\s+/i)[0].replace(/^.*?\s[—–]\s*/, "")))
    .filter((fp) => fp.length >= 3);

  const caseMatchRegex = /([A-Z][A-Za-z0-9&.,\s]{2,30})\s+(?:v\.|vs\.)\s+([A-Z][A-Za-z0-9&.,\s]{2,30})/g;
  let cMatch;
  while ((cMatch = caseMatchRegex.exec(fullText)) !== null) {
    const party1 = cMatch[1].trim().toLowerCase();
    // Exclude generic procedural, statutory, or conceptual comparisons
    if (
      party1.startsWith("section") ||
      party1.startsWith("article") ||
      party1.startsWith("order") ||
      party1.startsWith("rule") ||
      party1.startsWith("claimant") ||
      party1.startsWith("arbitration") ||
      party1.startsWith("mediation")
    ) {
      continue;
    }
    const party1Norm = normalize(party1);
    const isAllowed =
      party1Norm.length > 0 &&
      (allowedCitationsNorm.some((c) => c.includes(party1Norm)) ||
        allowedFirstParties.some((fp) => party1Norm.endsWith(fp)));

    if (!isAllowed) {
      violations.push(`AI cited unauthorized case or party: "${cMatch[0]}" (only verified precedents retrieved for this request may be cited)`);
    }
  }

  // 4b. Law-report citations (SCC / SCR / AIR / SCC OnLine) must belong to a verified retrieved precedent
  const reporterRegex = /\(\d{4}\)\s*\d+\s*(?:SCC|SCR)\s*\d+|\d{4}\s*SCC\s*OnLine\s*[A-Za-z]+\s*\d+|AIR\s*\d{4}\s*[A-Za-z]+\s*\d+/g;
  let rMatch;
  while ((rMatch = reporterRegex.exec(fullText)) !== null) {
    const refNorm = normalize(rMatch[0]);
    if (!allowedCitationsNorm.some((c) => c.includes(refNorm))) {
      violations.push(`AI cited unauthorized law-report citation: "${rMatch[0]}" (only verified precedents retrieved for this request may be cited)`);
    }
  }

  // 6. Law-data only: every section number must come from the allowed list, the framed issues or the supplied statutory text
  const allowedSections = new Set(BASE_ALLOWED_SECTIONS);
  const brief = deterministicReport.brief;
  if (brief) {
    extractSectionNumbers(
      [
        ...brief.issues.flatMap((i) => [...(i.applicableLaw || []), ...(i.provisions || []).map((p) => `Section ${p.section}`)]),
        ...(brief.statutoryChecks || []).map((c) => c.basis)
      ].join(" \n ")
    ).forEach((n) => allowedSections.add(n));
  }
  for (const n of extractSectionNumbers(fullText)) {
    if (!allowedSections.has(n)) {
      violations.push(`AI referred to Section ${n}, which is not in the legal data supplied for this request.`);
    }
  }

  // 5. Neutrality: no outcome predictions, strength ratings, likelihoods or settlement outlook
  const PREDICTIVE_PATTERNS = [
    /\blikely to (?:succeed|fail|win|lose|prevail|be (?:allowed|dismissed|decreed|awarded))\b/i,
    /\b(?:will|would|should) (?:succeed|fail|win|lose|prevail)\b/i,
    /\b(?:chances?|prospects?|probability|likelihood|odds) of (?:success|winning|losing|recovery|succeeding|prevailing)\b/i,
    /\b(?:strong|weak|stronger|weaker|robust|winning|losing) (?:case|claim|defen[cs]e|position)\b/i,
    /\b(?:full|partial|substantial) recovery (?:is )?likely\b/i,
    /\b(?:high|medium|low|moderate) likelihood\b/i,
    /\bsettlement outlook\b/i,
    /\bis bound to (?:succeed|fail)\b/i
  ];
  for (const re of PREDICTIVE_PATTERNS) {
    const m = fullText.match(re);
    if (m) {
      violations.push(`AI used outcome-prediction language: "${m[0]}". The brief must stay neutral and must not predict or rate the outcome.`);
    }
  }

  return violations;
}

/**
 * Merge AI analysis into the engine-framed issues. Engine findings stay locked;
 * the AI contributes positions, analysis and evidence for each issue.
 */
export function mergeBriefWithAI(brief, ai) {
  const byId = new Map((ai.issues || []).map((i) => [i.issue_id, i]));
  const issues = brief.issues.map((issue) => {
    const a = byId.get(issue.id);
    if (!a) return issue;
    return {
      ...issue,
      claimantPosition: a.claimant_position || issue.claimantPosition,
      respondentPosition: a.respondent_position || issue.respondentPosition,
      analysis: a.analysis,
      evidenceNeeded: Array.from(new Set([...(issue.evidenceNeeded || []), ...(a.evidence_needed || [])]))
    };
  });
  (ai.additional_issues || []).forEach((x, idx) => {
    issues.push({
      id: `ADDITIONAL_${idx + 1}`,
      title: x.issue,
      claimantPosition: x.claimant_position,
      respondentPosition: x.respondent_position,
      applicableLaw: x.applicable_law || [],
      finding: "",
      analysis: x.analysis,
      evidenceNeeded: x.evidence_needed || [],
      raisedBy: "ai"
    });
  });
  return {
    ...brief,
    statementOfFacts: ai.statement_of_facts,
    issues,
    pointsForDetermination: issues.map((i) => i.title),
    assumptions: ai.assumptions || []
  };
}

/**
 * Core Assessment Engine Handler
 */
export async function executeAssessment(intakeData = {}, options = {}) {
  // Guidance-only categories never call the AI provider (no approved rules to ground it on,
  // and these forms can hold sensitive personal data). The browser normally handles them
  // locally; this is a server-side safety net.
  const guidanceModule = getGuidanceModule(intakeData.category);
  if (guidanceModule) {
    return { success: true, data: guidanceModule.generateGuidance(intakeData) };
  }

  // 1. Generate Deterministic Statutory Baseline (Plain Code, Zero Hallucination)
  const deterministicReport = generateDeterministicAssessment(intakeData);

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

  // If no Claude API key configured or demo mode forced, return deterministic rules-engine assessment
  if (!apiKey || options.forceFallback) {
    return {
      success: true,
      data: {
        ...deterministicReport,
        engineType: "Rules-engine assessment",
        modelUsed: "JustNivaran Institutional Rules Engine (Deterministic v3.1)",
        isLiveAI: false
      }
    };
  }

  const anthropic = new Anthropic({ apiKey });
  const userPrompt = buildClaudePrompt({
    intakeData,
    deterministicData: deterministicReport
  });

  // Call Claude with 12s timeout & single retry
  let rawJson = null;
  let validatedAiData = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), CLAUDE_TIMEOUT_MS);

    try {
      const messages = [{ role: "user", content: userPrompt }];

      if (attempt === 2 && rawJson) {
        messages.push({ role: "assistant", content: rawJson });
        messages.push({
          role: "user",
          content: "The previous output was not valid JSON conforming to the schema. Output STRICT, VALID JSON ONLY conforming to the schema."
        });
      }

      const response = await anthropic.messages.create(
        {
          model,
          temperature: 0.1,
          max_tokens: 3500,
          system: CLAUDE_SYSTEM_PROMPT,
          messages
        },
        { signal: controller.signal }
      );

      clearTimeout(timeoutHandle);

      const contentText = response.content?.[0]?.text || "";
      rawJson = cleanJsonOutput(contentText);
      const parsedObj = JSON.parse(rawJson);
      validatedAiData = AIAssessmentResponseSchema.parse(parsedObj);

      // Post-Validation Integrity Check: Prohibit %, invented rupees, unlisted dates, unlisted cases
      const violations = validateAITextIntegrity(validatedAiData, deterministicReport, intakeData);
      if (violations.length > 0) {
        if (attempt === 1) {
          messages.push({ role: "assistant", content: rawJson });
          messages.push({
            role: "user",
            content: `The output failed validation with the following violations:\n${violations.map((v) => `- ${v}`).join("\n")}\n\nSTRICT RULES:\n1. NEVER output the '%' symbol.\n2. Do NOT invent rupee figures.\n3. Do NOT invent any dates not in the case data or engine findings.\n4. Do NOT name any case or party not in the allowed list.\n5. Do NOT predict, rate or hint at the outcome.\nRegenerate strictly compliant JSON.`
          });
          continue;
        } else {
          // Attempt 2 also failed post-validation: trigger graceful fallback
          throw new Error(`POST_VALIDATION_FAILED: ${violations.join("; ")}`);
        }
      }

      break; // Succeeded
    } catch (err) {
      clearTimeout(timeoutHandle);
      if (attempt === 2) {
        // Fall back gracefully to deterministic rules engine
        return {
          success: true,
          data: {
            ...deterministicReport,
            requestId: `JN-RULES-${Math.floor(100000 + Math.random() * 900000)}`,
            engineType: "Rules-engine assessment",
            modelUsed: "JustNivaran Institutional Rules Engine (Deterministic v3.1)",
            isLiveAI: false,
            fallbackReason: err.name === "AbortError" ? "API_TIMEOUT (>12s)" : (err.message || "SCHEMA_VALIDATION_FALLBACK")
          }
        };
      }
    }
  }

  if (!validatedAiData) {
    return {
      success: true,
      data: {
        ...deterministicReport,
        requestId: `JN-RULES-${Math.floor(100000 + Math.random() * 900000)}`,
        engineType: "Rules-engine assessment",
        modelUsed: "JustNivaran Institutional Rules Engine (Deterministic v3.1)",
        isLiveAI: false
      }
    };
  }

  // ENGINE FIELDS ARE LOCKED; the AI only contributes neutral analysis text.
  const finalReport = {
    ...deterministicReport,
    requestId: `JN-AI-${Math.floor(100000 + Math.random() * 900000)}`,
    generatedAt: new Date().toISOString(),
    engineType: "AI-assisted assessment (Claude)",
    modelUsed: `Anthropic Claude Sonnet 5.5 (${model})`,
    isLiveAI: true,
    brief: mergeBriefWithAI(deterministicReport.brief, validatedAiData),
    evidenceGaps: Array.from(new Set([...(deterministicReport.evidenceGaps || []), ...(validatedAiData.evidence_gaps || [])])),
    recommendedNextSteps: validatedAiData.procedural_next_steps,
    disclaimer: "Neutral case brief. Analysis drafted with AI assistance and checked against the rules engine; it records issues and applicable law, does not predict or recommend any outcome, and is not legal advice."
  };

  return {
    success: true,
    data: finalReport
  };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");

  // Health check endpoint (GET /api/assess?health=1)
  if (req.method === "GET") {
    const isConfigured = Boolean(process.env.ANTHROPIC_API_KEY?.trim());
    return res.status(200).json({
      status: "active",
      provider: "anthropic",
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
      keyConfigured: isConfigured,
      message: isConfigured
        ? "JustNivaran AI Assessment Engine Active • Claude Sonnet 5.5"
        : "Rules engine active"
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "METHOD_NOT_ALLOWED",
      message: "Only POST requests are accepted."
    });
  }

  // Rate Limiting Check
  const clientId = getHashedClientId(req);
  const rateLimitResult = checkRateLimit(clientId);
  if (!rateLimitResult.allowed) {
    return res.status(429).json({
      success: false,
      error: "RATE_LIMIT_EXCEEDED",
      message: `Too many requests. Please retry in ${rateLimitResult.retryAfterSeconds} seconds.`,
      retryAfterSeconds: rateLimitResult.retryAfterSeconds
    });
  }

  const payload = req.body || {};

  // Input Length Limit Check
  if (!validateInputLength(payload)) {
    return res.status(400).json({
      success: false,
      error: "PAYLOAD_TOO_LARGE",
      message: `Dispute input text exceeds the maximum character threshold of ${MAX_TOTAL_INPUT_CHARS} characters.`
    });
  }

  try {
    const result = await executeAssessment(payload);
    return res.status(200).json(result);
  } catch (err) {
    // Return deterministic fallback so demo never breaks
    const fallback = generateDeterministicAssessment(payload);
    return res.status(200).json({
      success: true,
      data: {
        ...fallback,
        engineType: "Rules-engine assessment",
        modelUsed: "JustNivaran Institutional Rules Engine (Deterministic v3.1)",
        isLiveAI: false
      }
    });
  }
}
