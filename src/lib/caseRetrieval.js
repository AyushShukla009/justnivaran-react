/**
 * JustNivaran Case-Bank Retrieval Layer (local only — no external legal database)
 *
 * Source: src/data/cases.json
 *   { citation, court, year, subject, holding, source_link, verified,
 *     equivalent_citations?, bench?, decided_on?, headnote?, treatment? }
 *
 * Rules:
 * 1. Retrieval scores each case against the facts of THIS request (category,
 *    facts, claims, defences) by keyword overlap with the case's `subject`.
 * 2. Only cases that are BOTH retrieved for this request AND marked
 *    `verified: true` are returned as `relatedPrecedents`.
 * 3. `relatedPrecedents` is the only list of case law the AI is allowed to cite,
 *    and the only list shown in the report's "Related precedents" section.
 */

import CASE_BANK from "../data/cases.json" with { type: "json" };

export const MAX_RETRIEVED_CASES = 5;

const STOPWORDS = new Set([
  "the", "and", "for", "with", "from", "that", "this", "under", "into", "upon",
  "was", "were", "are", "has", "have", "had", "not", "but", "any", "all", "its",
  "our", "their", "your", "who", "which", "been", "being", "per", "via", "etc",
  "act", "section", "dispute", "disputes", "case", "claim", "claims", "party", "parties"
]);

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

function isWellFormed(c) {
  return (
    c &&
    typeof c.citation === "string" &&
    c.citation.trim() !== "" &&
    typeof c.subject === "string" &&
    c.subject.trim() !== ""
  );
}

function toPublicRecord(c) {
  return {
    citation: c.citation,
    court: c.court || "",
    year: c.year ?? "",
    subject: c.subject,
    holding: c.holding || "",
    source_link: typeof c.source_link === "string" && /^https?:\/\//i.test(c.source_link) ? c.source_link : "",
    verified: c.verified === true,
    // Optional SCC-style metadata
    equivalent_citations: Array.isArray(c.equivalent_citations) ? c.equivalent_citations.filter((x) => typeof x === "string" && x.trim()) : [],
    bench: typeof c.bench === "string" ? c.bench : "",
    decided_on: typeof c.decided_on === "string" ? c.decided_on : "",
    headnote: typeof c.headnote === "string" ? c.headnote : "",
    treatment: typeof c.treatment === "string" ? c.treatment : ""
  };
}

/**
 * Retrieve case-bank entries relevant to this intake.
 *
 * @param {Object} intakeData - the predictor intake for this request
 * @param {Array}  [bank]     - case bank override (tests); defaults to cases.json
 * @returns {{ retrieved: Array, relatedPrecedents: Array }}
 */
export function retrieveCases(intakeData = {}, bank = CASE_BANK) {
  const queryTokens = new Set(
    tokenize(
      [
        intakeData.category,
        intakeData.factsSummary,
        intakeData.breachDetails,
        intakeData.factualChronology,
        intakeData.primaryClaims,
        intakeData.expectedDefenses
      ].join(" ")
    )
  );

  if (queryTokens.size === 0 || !Array.isArray(bank)) {
    return { retrieved: [], relatedPrecedents: [] };
  }

  const retrieved = bank
    .filter(isWellFormed)
    .map((c) => {
      const subjectTokens = new Set(tokenize(c.subject));
      let score = 0;
      subjectTokens.forEach((t) => {
        if (queryTokens.has(t)) score += 1;
      });
      return { record: toPublicRecord(c), score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RETRIEVED_CASES)
    .map((r) => r.record);

  return {
    retrieved,
    relatedPrecedents: retrieved.filter((c) => c.verified === true)
  };
}
