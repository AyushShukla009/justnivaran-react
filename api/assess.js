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
import { AIAssessmentResponseSchema } from "../src/lib/aiAssessmentSchema.js";
import {
  CLAUDE_SYSTEM_PROMPT,
  buildClaudePrompt,
  ALLOWED_CASE_AUTHORITIES
} from "../src/lib/claudeAssessmentPrompt.js";

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
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "unknown-agent";
  const secret = process.env.RATE_LIMIT_HMAC_SECRET || "justnivaran-hmac-secret-2026";

  return crypto
    .createHmac("sha256", secret)
    .update(`${ip}:${userAgent}`)
    .digest("hex");
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
 * 4. Forbids citing any case or party not in the ALLOWED_CASE_AUTHORITIES list.
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
    intakeData.factualChronology
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
  const caseMatchRegex = /([A-Z][A-Za-z0-9&.,\s]{2,30})\s+(?:v\.|vs\.)\s+([A-Z][A-Za-z0-9&.,\s]{2,30})/g;
  let cMatch;
  const allowedCasesJoined = ALLOWED_CASE_AUTHORITIES.join(" ").toLowerCase();
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
    const isAllowed = [
      "patil automation",
      "silpi industries",
      "gujarat state civil supplies",
      "kailash nath",
      "saw pipes",
      "cognizance for extension"
    ].some((allowedKeyword) => party1.includes(allowedKeyword) || allowedCasesJoined.includes(party1));

    if (!isAllowed) {
      violations.push(`AI cited unauthorized case or party: "${cMatch[0]}"`);
    }
  }

  return violations;
}

/**
 * Core Assessment Engine Handler
 */
export async function executeAssessment(intakeData = {}, options = {}) {
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

      // Contradiction Check: If AI contradicted the deterministic strength ratings, retry once on attempt 1
      if (
        attempt === 1 &&
        (validatedAiData.claim_strength.rating !== deterministicReport.claimStrength.rating ||
          validatedAiData.defence_strength.rating !== deterministicReport.defenceStrength.rating)
      ) {
        messages.push({ role: "assistant", content: rawJson });
        messages.push({
          role: "user",
          content: `Correction required: The claim strength rating must be "${deterministicReport.claimStrength.rating}" and defence strength rating must be "${deterministicReport.defenceStrength.rating}" as established by the institutional statutory baseline. Please adjust your reasons and output strictly compliant JSON.`
        });
        continue;
      }

      // Post-Validation Integrity Check: Prohibit %, invented rupees, unlisted dates, unlisted cases
      const violations = validateAITextIntegrity(validatedAiData, deterministicReport, intakeData);
      if (violations.length > 0) {
        if (attempt === 1) {
          messages.push({ role: "assistant", content: rawJson });
          messages.push({
            role: "user",
            content: `The output failed statutory integrity validation with the following violations:\n${violations.map((v) => `- ${v}`).join("\n")}\n\nSTRICT RULES:\n1. NEVER output the '%' symbol.\n2. Do NOT invent rupee settlement figures.\n3. Do NOT invent any dates not in the input facts.\n4. Do NOT name any unlisted court cases or parties.\nRegenerate strictly compliant JSON.`
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

  // Confidence Rule: Confidence cannot be "High" if any evidence gap exists
  const hasEvidenceGaps =
    (Array.isArray(validatedAiData.evidence_gaps) && validatedAiData.evidence_gaps.length > 0) ||
    (Array.isArray(deterministicReport.evidenceGaps) && deterministicReport.evidenceGaps.length > 0) ||
    (Array.isArray(deterministicReport.claimantGaps) && deterministicReport.claimantGaps.length > 0);

  let finalConfidence = validatedAiData.confidence;
  if (hasEvidenceGaps && finalConfidence === "High") {
    finalConfidence = "Moderate";
  }

  // PROGRAMMATIC IMMUTABLE OVERWRITE:
  // Overwrite statutory, limitation, Sec 12A, MSMED, fee, forum, and strength fields with authoritative deterministic engine values
  const finalReport = {
    ...deterministicReport,
    ...validatedAiData,

    // Overwrite with JN-AI- dossier reference
    requestId: `JN-AI-${Math.floor(100000 + Math.random() * 900000)}`,
    generatedAt: new Date().toISOString(),
    engineType: "AI-assisted assessment (Claude)",
    modelUsed: `Anthropic Claude Sonnet 5.5 (${model})`,
    isLiveAI: true,

    // Lock statutory deterministic engine fields (Limitation, Section 12A, MSMED, fees, forum)
    limitation: deterministicReport.limitation,
    section12A: deterministicReport.section12A,
    msmed: deterministicReport.msmed,
    forumRecommendation: deterministicReport.forumRecommendation,
    processComparison: deterministicReport.processComparison,
    claimQuantum: deterministicReport.claimQuantum,
    claimQuantumFormatted: deterministicReport.claimQuantumFormatted,

    // Enforce deterministic strength ratings programmatically
    claimStrength: {
      rating: deterministicReport.claimStrength.rating,
      reasons: validatedAiData.claim_strength.reasons || deterministicReport.claimStrength.reasons
    },
    defenceStrength: {
      rating: deterministicReport.defenceStrength.rating,
      reasons: validatedAiData.defence_strength.reasons || deterministicReport.defenceStrength.reasons
    },

    // Qualitative settlement outlook (NO percentages, NO rupee figures from AI)
    settlementOutlook: validatedAiData.settlement_outlook || deterministicReport.settlementOutlook,

    claimantGaps: deterministicReport.claimantGaps,
    evidenceGaps: Array.from(new Set([...deterministicReport.evidenceGaps, ...(validatedAiData.evidence_gaps || [])])),

    confidence: finalConfidence,

    disclaimer: "AI-assisted indicative assessment. Not legal advice. Outcomes depend on evidence and the neutral's independent adjudication."
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
        : "JustNivaran Rules-Engine Active (AI Key not configured • Deterministic mode)"
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
