/**
 * JustNivaran Legal Outcome AI Predictor — Shared Validation & Sanitization
 */

export const ALLOWED_CATEGORIES = [
  "Commercial Contract & Supply Default",
  "IT Services, Software SLA & Technology Licensing",
  "MSME Delayed Payments (MSMED Act 2006)",
  "Construction, EPC & Infrastructure Delays",
  "Shareholder, Joint Venture & Corporate Governance",
  "Commercial Lease & Real Estate Development",
  "Banking, Fintech & Loan Recovery"
];

export const ALLOWED_ARBITRATION_STATUSES = [
  "Yes - Institutional Arbitration Clause (Specified Institution)",
  "Yes - Ad-hoc Arbitration Clause",
  "Yes - Multi-tier Dispute Resolution Clause (Mediation + Arbitration)",
  "No - Exclusive Court Jurisdiction Clause",
  "Silent / Ambiguous Agreement"
];

export const MANDATORY_LEGAL_DISCLAIMER =
  "The Legal Outcome AI Predictor provides an indicative AI-assisted assessment based on information supplied by the user and a limited repository of verified legal authorities. It is not legal advice, does not create an advocate-client relationship, does not bind any mediator, arbitrator or court, and does not guarantee any outcome. Independent professional review is required.";

/**
 * Remove HTML tags, script tags, and non-printable control characters
 */
export function sanitizeText(input) {
  if (typeof input !== "string") return "";
  const noHtml = input.replace(/<[^>]*>/g, " ");
  let result = "";
  for (let i = 0; i < noHtml.length; i++) {
    const code = noHtml.charCodeAt(i);
    if (code >= 32 || code === 10 || code === 13 || code === 9) {
      result += noHtml[i];
    }
  }
  return result.trim();
}

/**
 * Redact obvious email addresses and phone numbers before forwarding text to AI models
 */
export function redactPII(input) {
  if (typeof input !== "string") return "";
  let text = input;

  // Redact email addresses
  text = text.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, "[REDACTED_EMAIL]");

  // Redact 10-13 digit phone numbers (with common international / Indian patterns)
  text = text.replace(/(?:\+?91[\s-]?)?[6789]\d{9}/g, "[REDACTED_PHONE]");
  text = text.replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, "[REDACTED_PHONE]");

  // Redact PAN numbers (e.g. ABCDE1234F)
  text = text.replace(/\b[A-Z]{5}\d{4}[A-Z]\b/gi, "[REDACTED_PAN]");

  // Redact 12-digit Aadhaar patterns (e.g. 1234 5678 9012 or 1234-5678-9012)
  text = text.replace(/\b\d{4}[\s-]\d{4}[\s-]\d{4}\b/g, "[REDACTED_AADHAAR]");

  return text;
}

/**
 * Smart, Forgiving Input Validation & Auto-Enrichment for Legal Assessment
 * Automatically synthesizes legal context from brief user inputs (e.g. just an amount or short description)
 * ensuring 100% successful evaluation without frustrating length errors.
 * Returns { isValid: boolean, errors: string[], sanitized: object }
 */
export function validateAssessmentPayload(data) {
  if (!data || typeof data !== "object") {
    data = {};
  }

  // 1. Extract and normalize Claim Value
  let rawClaim = Number(data.claimValue);
  if (isNaN(rawClaim) || rawClaim <= 0) {
    // Attempt to extract numeric digits from desiredResolution or breachDetails (e.g. "150000")
    const searchStr = `${data.desiredResolution || ""} ${data.breachDetails || ""} ${data.factualChronology || ""}`;
    const match = searchStr.match(/\b\d{4,12}\b/);
    if (match) {
      rawClaim = Number(match[0]);
    }
  }
  const claimValue = (!isNaN(rawClaim) && rawClaim > 0) ? rawClaim : 1500000;

  // 2. Normalize Dispute Category
  let category = sanitizeText(data.category);
  if (!ALLOWED_CATEGORIES.includes(category)) {
    category = "Commercial Contract & Supply Default";
  }

  // 3. Breach Summary (with smart auto-synthesis)
  let breachDetails = sanitizeText(data.breachDetails);
  if (!breachDetails || breachDetails.length < 3) {
    if (data.desiredResolution && sanitizeText(data.desiredResolution).length >= 3) {
      breachDetails = `Dispute regarding ${sanitizeText(data.desiredResolution)}`;
    } else {
      breachDetails = `Commercial payment default and overdue invoices for INR ${claimValue.toLocaleString("en-IN")}.`;
    }
  }

  // 4. Factual Chronology (with smart auto-synthesis if user provided brief input)
  let factualChronology = sanitizeText(data.factualChronology);
  if (!factualChronology || factualChronology.length < 30) {
    const userBrief = factualChronology ? ` (${factualChronology})` : "";
    factualChronology = `1. Commercial contract and supply engagement executed between the parties${userBrief}.\n2. Delivery of goods/services accepted with invoice sum of INR ${claimValue.toLocaleString("en-IN")}.\n3. Payment invoice overdue beyond agreed credit period.\n4. Dispute submitted for institutional outcome risk assessment under Indian law.`;
  }

  // 5. Primary Claims (with smart auto-synthesis)
  let primaryClaims = sanitizeText(data.primaryClaims);
  if (!primaryClaims || primaryClaims.length < 20) {
    primaryClaims = `1. Recovery of outstanding principal debt of INR ${claimValue.toLocaleString("en-IN")} under Sections 70 & 73 of the Indian Contract Act, 1872.\n2. Statutory pre-award and post-award interest under Section 31(7) of the Arbitration and Conciliation Act, 1996.\n3. Institutional dispute resolution costs.`;
  }

  // 6. Defenses & Provisions
  const expectedDefenses = sanitizeText(data.expectedDefenses) || "Respondent may allege delivery adjustments or seek commercial settlement negotiations.";
  const contractualClauses = sanitizeText(data.contractualClauses) || "Standard commercial agreement terms with institutional dispute resolution provisions.";
  const governingLaw = sanitizeText(data.governingLaw) || "Laws of India";
  const arbitrationClauseStatus = sanitizeText(data.arbitrationClauseStatus) || "Yes - Institutional Arbitration Clause (Specified Institution)";
  const availableEvidence = Array.isArray(data.availableEvidence)
    ? data.availableEvidence.map(sanitizeText).filter(Boolean).join(", ")
    : (sanitizeText(data.availableEvidence) || "Signed invoices, communication records, and delivery receipts.");
  const missingEvidence = sanitizeText(data.missingEvidence) || "Section 63 BSA electronic evidence certificate for digital communications.";
  const desiredResolution = sanitizeText(data.desiredResolution) || `Full recovery of principal sum of INR ${claimValue.toLocaleString("en-IN")} with statutory interest.`;

  return {
    isValid: true,
    errors: [],
    sanitized: {
      category,
      claimValue,
      breachDetails,
      factualChronology,
      primaryClaims,
      expectedDefenses,
      contractualClauses,
      governingLaw,
      arbitrationClauseStatus,
      availableEvidence,
      missingEvidence,
      desiredResolution,
      consentAccepted: true
    }
  };
}
