/**
 * Statute bank — verbatim provision text from official sources (India Code).
 *
 * Source: src/data/statutes.json
 *   { id, act, section, heading, text: [paragraphs], source_link, source_name,
 *     retrieved_on, verified, verification_note }
 *
 * Only entries marked verified: true are ever shown or sent to the AI.
 * Issues reference provisions by id; ids that are not yet in the bank are
 * simply skipped (the brief still names the provision, without its text).
 */

import STATUTE_BANK from "../data/statutes.json" with { type: "json" };

const BY_ID = new Map(
  (Array.isArray(STATUTE_BANK) ? STATUTE_BANK : [])
    .filter((p) => p && p.verified === true && typeof p.id === "string" && Array.isArray(p.text) && p.text.length)
    .map((p) => [p.id, p])
);

export function getVerifiedProvisions(ids = []) {
  const out = [];
  const seen = new Set();
  for (const id of ids) {
    const p = BY_ID.get(id);
    if (p && !seen.has(id)) {
      seen.add(id);
      out.push({
        id: p.id,
        act: p.act,
        section: p.section,
        heading: p.heading,
        text: p.text,
        source_link: /^https?:\/\//i.test(p.source_link || "") ? p.source_link : "",
        source_name: p.source_name || "",
        retrieved_on: p.retrieved_on || ""
      });
    }
  }
  return out;
}

/** Provision ids the rules engine may attach to issues (filled in as official text is added). */
export const PROVISION_IDS = {
  LIMITATION: ["LA-1963-ART55", "LA-1963-ART113", "LA-1963-S18"],
  SECTION_12A: ["CCA-2015-S12A"],
  ARBITRATION_AGREEMENT: ["ACA-1996-S7", "ACA-1996-S8"],
  MSMED: ["MSMED-2006-S2", "MSMED-2006-S15", "MSMED-2006-S16", "MSMED-2006-S18"],
  MERITS: ["ICA-1872-S73"],
  MERITS_PENALTY: ["ICA-1872-S74"]
};
