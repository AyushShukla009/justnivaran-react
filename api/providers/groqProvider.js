/**
 * JustNivaran Legal Outcome AI Predictor — Groq Provider Adapter
 * Connects to Groq's OpenAI-compatible chat completions endpoint.
 *
 * Security Guarantee:
 * - Reads API key exclusively from process.env.GROQ_API_KEY.
 * - Never prints, logs, or returns API keys or raw provider error payloads to client.
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Validates and sanitizes categorical likelihood bands
 */
function normalizeLikelihoodBand(band) {
  const allowed = ["More Likely", "Plausible", "Less Likely", "Insufficient Information"];
  if (allowed.includes(band)) return band;
  const lower = String(band || "").toLowerCase();
  if (lower.includes("more likely") || lower.includes("high")) return "More Likely";
  if (lower.includes("plausible") || lower.includes("moderate") || lower.includes("medium")) return "Plausible";
  if (lower.includes("less likely") || lower.includes("low")) return "Less Likely";
  return "Insufficient Information";
}

/**
 * Executes a protected smoke test asking Groq to reply with exactly "OK"
 */
export async function executeGroqSmokeTest(apiKey, modelName) {
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelName || process.env.GROQ_MODEL || "openai/gpt-oss-120b",
        messages: [
          { role: "user", content: "Reply with only the word OK" }
        ],
        temperature: 0.0,
        max_tokens: 10
      }),
      signal: controller.signal
    });

    if (!res.ok) {
      const status = res.status;
      return {
        success: false,
        httpStatus: status,
        error: status === 401 ? "UNAUTHORIZED" : status === 429 ? "RATE_LIMITED" : "PROVIDER_ERROR"
      };
    }

    const data = await res.json();
    const content = (data?.choices?.[0]?.message?.content || "").trim();

    if (content.toUpperCase().includes("OK")) {
      return { success: true, text: "OK" };
    }

    return { success: false, error: "UNEXPECTED_RESPONSE", text: content };
  } catch (err) {
    if (err?.name === "AbortError") {
      return { success: false, error: "TIMEOUT" };
    }
    return { success: false, error: "NETWORK_ERROR" };
  } finally {
    clearTimeout(timeoutHandle);
  }
}

/**
 * Generates structured legal risk and outcome assessment via Groq
 */
export async function generateGroqAssessment(apiKey, modelName, promptText, systemInstruction) {
  const model = modelName || process.env.GROQ_MODEL || "openai/gpt-oss-120b";
  const executeCall = async (isRetry = false) => {
    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), 35000);

    try {
      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemInstruction },
            {
              role: "user",
              content: isRetry
                ? `${promptText}\n\nIMPORTANT: Return ONLY valid JSON adhering exactly to the requested schema. Do not enclose in markdown blocks or include trailing commentary.`
                : promptText
            }
          ],
          temperature: 0.2,
          response_format: { type: "json_object" },
          max_tokens: 3500
        }),
        signal: controller.signal
      });

      if (!res.ok) {
        const status = res.status;
        const errType = status === 401 ? "PROVIDER_AUTH_UNAVAILABLE" : status === 429 ? "PROVIDER_RATE_LIMITED" : "PROVIDER_ERROR";
        const err = new Error(`Groq provider returned HTTP ${status}`);
        err.status = status;
        err.code = errType;
        throw err;
      }

      const data = await res.json();
      const rawText = (data?.choices?.[0]?.message?.content || "").trim();
      return rawText;
    } finally {
      clearTimeout(timeoutHandle);
    }
  };

  let rawContent;
  let parsed;

  try {
    rawContent = await executeCall(false);
    parsed = JSON.parse(rawContent);
  } catch (firstErr) {
    if (firstErr?.status) {
      throw firstErr;
    }
    // Controlled single retry if JSON parsing failed
    try {
      rawContent = await executeCall(true);
      const cleanJson = rawContent.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleanJson);
    } catch {
      throw new Error("INVALID_JSON_RESPONSE");
    }
  }

  // Normalize likelihood bands in outcome scenarios
  if (Array.isArray(parsed?.likelyOutcomeScenarios)) {
    parsed.likelyOutcomeScenarios = parsed.likelyOutcomeScenarios.map((s) => ({
      scenarioName: s.scenarioName || "Outcome Scenario",
      likelihoodBand: normalizeLikelihoodBand(s.likelihoodBand),
      supportingReasons: s.supportingReasons || "",
      contraryFactors: s.contraryFactors || "",
      additionalEvidenceRequired: s.additionalEvidenceRequired || ""
    }));
  }

  return {
    rawText: rawContent,
    parsed
  };
}
