/**
 * Shared helpers for the guidance-only predictor categories
 * (Family / Matrimonial, Non-commercial civil, Miscellaneous).
 *
 * These categories:
 * - never call the AI provider and never leave the browser (computed client-side);
 * - never use commercial rules (MSMED Act, Section 12A, commercial limitation logic);
 * - never produce strength ratings, outcome scenarios, settlement outlook,
 *   recovery predictions or fee comparisons;
 * - show "[to be provided]" wherever approved legal content is not yet available.
 */

export const TO_BE_PROVIDED = "[to be provided]";

export const GUIDANCE_DISCLAIMER =
  "General process guidance only. Not legal advice and not a prediction of any outcome. Legal content marked [to be provided] is pending approval by JustNivaran.";

/**
 * Validate an intake against a module's field definitions.
 * Returns an error message string, or "" when valid.
 */
export function validateGuidanceIntake(fields, intake = {}) {
  for (const f of fields) {
    const v = intake[f.name];
    if (f.required && (v === undefined || v === null || String(v).trim() === "")) {
      return `Please complete: ${f.label}`;
    }
    if (f.type === "select" && v && !f.options.some((o) => o.value === v)) {
      return `Please choose a valid option for: ${f.label}`;
    }
    if (f.maxLength && typeof v === "string" && v.length > f.maxLength) {
      return `${f.label} must be ${f.maxLength} characters or fewer.`;
    }
  }
  return "";
}

/** Human-readable echo of the structured (non-free-text) answers. */
export function summarizeAnswers(fields, intake = {}) {
  return fields
    .filter((f) => f.type === "select" && intake[f.name])
    .map((f) => {
      const opt = f.options.find((o) => o.value === intake[f.name]);
      return { label: f.label, value: opt ? opt.label : String(intake[f.name]) };
    });
}

/**
 * Look up content for a section, first by matter type, then the module default.
 * Content values are arrays of strings; absent content becomes [TO_BE_PROVIDED].
 */
export function contentFor(contentMap, sectionKey, matterType) {
  const section = contentMap?.[sectionKey] || {};
  const items = section[matterType] || section.default;
  return Array.isArray(items) && items.length ? items : [TO_BE_PROVIDED];
}

export function buildGuidanceReport({ module, intake, sections, notices = [] }) {
  return {
    reportType: "guidance",
    requestId: `JN-GUIDE-${Math.floor(100000 + Math.random() * 900000)}`,
    generatedAt: new Date().toISOString(),
    engineType: "Process guidance (no AI)",
    modelUsed: `JustNivaran ${module.label} guidance module`,
    isLiveAI: false,
    category: module.category,
    categoryLabel: module.label,
    answers: summarizeAnswers(module.fields, intake),
    notices,
    sections,
    disclaimer: GUIDANCE_DISCLAIMER
  };
}
