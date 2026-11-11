/**
 * Neutral Case Brief Builder (rules engine)
 *
 * Produces the structure of the Case Assessment Brief in the form a neutral
 * (arbitrator, mediator or judge) would expect:
 *   Particulars → Facts as stated → Statutory checks → Issues (both sides,
 *   applicable law, finding, evidence that would decide) → Points for determination.
 *
 * Neutrality rules:
 * - No outcome predictions, strength ratings, likelihoods or settlement outlook.
 * - Positions are taken only from what the parties supplied; otherwise "Not on record."
 * - Engine findings are computed from the stated dates/values and are labelled as such.
 */

import { getVerifiedProvisions, PROVISION_IDS } from "./statuteRetrieval.js";

export const NOT_ON_RECORD = "Not on record.";

const EVIDENCE_LABELS = {
  invoices: "Commercial tax invoices",
  delivery_proof: "Signed / stamped delivery challan",
  purchase_order: "Purchase order / work order",
  contract: "Executed contract / agreement",
  emails_whatsapp: "Email / WhatsApp correspondence",
  part_payment_proof: "Bank statement / part-payment proof",
  udyam_certificate: "Udyam registration certificate",
  joint_measurement_sheets: "Work completion / joint measurement sheet"
};

function clean(text) {
  const t = String(text || "").trim();
  return t.length ? t : "";
}

function fmtDate(iso) {
  if (!iso) return "not stated";
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" });
}

/**
 * @param {Object} intake - raw intake
 * @param {Object} det    - deterministic modules: { limitation, section12A, msmed, forumRecommendation, claimantGaps, evidenceGaps, quantum, hasArbitrationClause }
 */
export function buildCaseBrief(intake = {}, det = {}) {
  const { limitation = {}, section12A = {}, msmed = {}, forumRecommendation = {}, quantum = 0 } = det;
  const evidence = Array.isArray(intake.evidenceList) ? intake.evidenceList : [];
  const respondentStated = clean(intake.expectedDefenses);
  const claimantStated = clean(intake.primaryClaims);
  const facts = clean(intake.factsSummary || intake.breachDetails);
  const hasArbitrationClause = Boolean(det.hasArbitrationClause);
  const evidenceNeeded = Array.from(new Set([...(det.claimantGaps || []), ...(det.evidenceGaps || [])]));

  // ---- Particulars ----
  const particulars = [
    { label: "Nature of dispute", value: intake.category || "Commercial contract" },
    { label: "Amount claimed", value: `₹ ${Number(quantum || 0).toLocaleString("en-IN")}` },
    { label: "Date of breach / default (as stated)", value: fmtDate(intake.breachDate) },
    { label: "Written contract", value: intake.hasWrittenContract === false ? "Stated not to exist" : "Stated to exist" },
    { label: "Arbitration clause", value: hasArbitrationClause ? clean(intake.arbitrationClauseStatus) || "Stated to exist" : "Not stated" },
    { label: "Notice served", value: intake.hasNoticeSent ? "Stated to have been served" : "Not stated" },
    { label: "Urgent interim relief sought", value: intake.urgentInterimRelief ? "Yes" : "No" }
  ];
  if (intake.enterpriseType && intake.enterpriseType !== "None") {
    particulars.push({ label: "Claimant's enterprise status (as stated)", value: `${intake.enterpriseType} Enterprise${intake.udyamRegisteredAtContract ? ", Udyam-registered at contract date" : ""}` });
  }

  // ---- Facts as stated ----
  const factsAsStated = [];
  if (facts) factsAsStated.push(facts);
  if (clean(intake.factualChronology)) factsAsStated.push(clean(intake.factualChronology));
  if (evidence.length) {
    factsAsStated.push(`Documents stated to be available: ${evidence.map((e) => EVIDENCE_LABELS[e] || e).join("; ")}.`);
  }
  if (!factsAsStated.length) factsAsStated.push("No narrative of facts was supplied.");

  // ---- Statutory checks (engine-computed) ----
  const statutoryChecks = [
    {
      key: "limitation",
      title: "Limitation",
      basis: limitation.statutoryBasis || "Limitation Act, 1963",
      result: limitation.status || "Not computed",
      detail: limitation.expiryDate
        ? `Computed from the stated date of breach (${fmtDate(limitation.breachDate)}). Period expires on ${fmtDate(limitation.expiryDate)}${typeof limitation.daysRemaining === "number" ? ` (${limitation.daysRemaining} days remaining)` : ""}.${limitation.covidExcludedDays ? ` ${limitation.covidExcludedDays} days excluded for the COVID-19 period.` : ""}`
        : "The date of breach was not supplied, so limitation could not be computed."
    }
  ];
  if (section12A.status) {
    statutoryChecks.push({
      key: "section12A",
      title: "Pre-institution mediation",
      basis: "Section 12A, Commercial Courts Act, 2015",
      result: section12A.status,
      detail: section12A.rationale || ""
    });
  }
  if (intake.enterpriseType && intake.enterpriseType !== "None") {
    statutoryChecks.push({
      key: "msmed",
      title: "MSMED Act",
      basis: "Sections 15–19, MSMED Act, 2006",
      result: msmed.applicable ? "Prima facie applicable on the stated facts" : "Prima facie not applicable on the stated facts",
      detail: [msmed.rationale, msmed.applicable ? msmed.interestStartExplanation : ""].filter(Boolean).join(" ")
    });
  }

  // ---- Issues ----
  const issues = [];

  issues.push({
    id: "LIMITATION",
    title: "Whether the claim is within the period of limitation.",
    claimantPosition: intake.breachDate
      ? `The cause of action is stated to have arisen on ${fmtDate(intake.breachDate)}.${intake.signedWrittenAcknowledgment && intake.acknowledgmentDate ? ` A written acknowledgment dated ${fmtDate(intake.acknowledgmentDate)} is relied upon.` : ""}`
      : NOT_ON_RECORD,
    respondentPosition: NOT_ON_RECORD,
    applicableLaw: [
      limitation.statutoryBasis || "Limitation Act, 1963",
      ...(limitation.hasSection18Acknowledgment ? ["Section 18, Limitation Act, 1963 (effect of acknowledgment in writing)"] : [])
    ],
    finding: `${statutoryChecks[0].result}. ${statutoryChecks[0].detail}${limitation.acknowledgmentReviewNote ? ` ${limitation.acknowledgmentReviewNote}` : ""}`,
    evidenceNeeded: [
      "Document fixing the date on which payment fell due or performance was refused.",
      ...(intake.signedWrittenAcknowledgment ? ["The signed written acknowledgment relied upon, with proof of its date and signatory."] : [])
    ]
  });

  if (section12A.applicable) {
    issues.push({
      id: "SECTION_12A",
      title: "Whether pre-institution mediation under Section 12A of the Commercial Courts Act, 2015 must be exhausted before a suit is instituted.",
      claimantPosition: intake.urgentInterimRelief ? "Urgent interim relief is stated to be sought." : NOT_ON_RECORD,
      respondentPosition: NOT_ON_RECORD,
      applicableLaw: ["Section 12A, Commercial Courts Act, 2015", "Commercial Courts (Pre-Institution Mediation and Settlement) Rules, 2018"],
      finding: `${section12A.status}. ${section12A.rationale || ""}`.trim(),
      evidenceNeeded: ["Record of any pre-institution mediation already attempted, or of the urgency relied upon."]
    });
  }

  if (hasArbitrationClause) {
    issues.push({
      id: "ARBITRATION_AGREEMENT",
      title: "Whether the dispute is governed by an arbitration agreement and, if so, its scope.",
      claimantPosition: `An arbitration clause is stated to exist (${clean(intake.arbitrationClauseStatus) || "details not supplied"}).`,
      respondentPosition: NOT_ON_RECORD,
      applicableLaw: [
        "Section 7, Arbitration and Conciliation Act, 1996 (arbitration agreement)",
        "Section 8, Arbitration and Conciliation Act, 1996 (reference to arbitration)"
      ],
      finding: "The existence and wording of the clause have not been verified. Its scope must be read from the executed contract.",
      evidenceNeeded: ["Executed contract containing the arbitration clause."]
    });
  }

  if (intake.enterpriseType && intake.enterpriseType !== "None") {
    issues.push({
      id: "MSMED",
      title: "Whether the claimant can invoke Sections 15 to 18 of the MSMED Act, 2006, including statutory interest.",
      claimantPosition: `The claimant states it is a ${intake.enterpriseType} Enterprise${intake.udyamRegisteredAtContract ? " registered under Udyam on the date of the contract" : ""}.`,
      respondentPosition: NOT_ON_RECORD,
      applicableLaw: [
        "Section 2(b), MSMED Act, 2006 (appointed day)",
        "Section 15, MSMED Act, 2006 (time for payment)",
        "Section 16, MSMED Act, 2006 (interest)",
        "Section 18, MSMED Act, 2006 (reference to Facilitation Council)"
      ],
      finding: statutoryChecks.find((c) => c.key === "msmed")?.detail || "",
      evidenceNeeded: ["Udyam registration certificate showing the date of registration.", "Invoices and proof of acceptance of goods or services."]
    });
  }

  issues.push({
    id: "MERITS",
    title: "Whether the respondent committed a breach of contract and, if so, the relief to which the claimant is entitled.",
    claimantPosition: claimantStated || facts || NOT_ON_RECORD,
    respondentPosition: respondentStated || NOT_ON_RECORD,
    applicableLaw: [
      "Section 73, Indian Contract Act, 1872 (compensation for breach)",
      ...(/liquidated|penalt|section 74/i.test(`${respondentStated} ${facts}`) ? ["Section 74, Indian Contract Act, 1872 (stipulated damages)"] : [])
    ],
    finding: "This issue turns on evidence. No finding can be made on the material supplied.",
    evidenceNeeded: evidenceNeeded.length ? evidenceNeeded : ["Primary documents proving the contract, performance and non-payment."]
  });

  // ---- Attach verbatim statutory text (official source, verified only) ----
  const penaltyInPlay = /liquidated|penalt|section 74/i.test(`${respondentStated} ${facts}`);
  issues.forEach((issue) => {
    const ids = [...(PROVISION_IDS[issue.id] || []), ...(issue.id === "MERITS" && penaltyInPlay ? PROVISION_IDS.MERITS_PENALTY : [])];
    issue.provisions = getVerifiedProvisions(ids);
  });

  // ---- Points for determination (framed as a neutral would frame them) ----
  const pointsForDetermination = issues.map((i) => i.title);

  // ---- Procedural route (not an outcome) ----
  const procedure = {
    route: forumRecommendation.recommendedForum || "",
    basis: forumRecommendation.statutoryBasis || "",
    note: forumRecommendation.rationale || "",
    alternative: forumRecommendation.alternativeForum || ""
  };

  return { particulars, factsAsStated, statutoryChecks, issues, pointsForDetermination, procedure };
}
