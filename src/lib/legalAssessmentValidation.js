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

  return text;
}

/**
 * Strict Input Validation for Legal Assessment Payload
 * Returns { isValid: boolean, errors: string[], sanitized: object | null }
 */
export function validateAssessmentPayload(data) {
  const errors = [];

  if (!data || typeof data !== "object") {
    return { isValid: false, errors: ["Invalid payload structure."], sanitized: null };
  }

  // 1. Dispute Category
  const category = sanitizeText(data.category);
  if (!ALLOWED_CATEGORIES.includes(category)) {
    errors.push("Please select a valid commercial dispute category.");
  }

  // 2. Claim Value
  const claimValue = Number(data.claimValue);
  if (isNaN(claimValue) || claimValue <= 0 || claimValue > 1000000000000) {
    errors.push("Claim value must be a valid positive numerical amount (in INR).");
  }

  // 3. Date and Nature of Breach
  const breachDetails = sanitizeText(data.breachDetails);
  if (!breachDetails || breachDetails.length < 5 || breachDetails.length > 300) {
    errors.push("Please provide the approximate date and summary nature of breach (5–300 characters).");
  }

  // 4. Factual Chronology
  const factualChronology = sanitizeText(data.factualChronology);
  if (factualChronology.length < 100 || factualChronology.length > 10000) {
    errors.push(`Factual chronology must be between 100 and 10,000 characters (currently ${factualChronology.length} characters).`);
  }

  // 5. Claimant Claims
  const primaryClaims = sanitizeText(data.primaryClaims);
  if (primaryClaims.length < 50 || primaryClaims.length > 5000) {
    errors.push(`Primary claims must be between 50 and 5,000 characters (currently ${primaryClaims.length} characters).`);
  }

  // 6. Expected Defenses / Counterclaims
  const expectedDefenses = sanitizeText(data.expectedDefenses);
  if (expectedDefenses.length > 5000) {
    errors.push("Expected defenses cannot exceed 5,000 characters.");
  }

  // 7. Contractual Provisions / Clauses
  const contractualClauses = sanitizeText(data.contractualClauses);
  if (contractualClauses.length > 5000) {
    errors.push("Contractual clauses text cannot exceed 5,000 characters.");
  }

  // 8. Governing Law
  const governingLaw = sanitizeText(data.governingLaw) || "Laws of India";
  if (governingLaw.length > 200) {
    errors.push("Governing law cannot exceed 200 characters.");
  }

  // 9. Arbitration Clause Status
  const arbitrationClauseStatus = sanitizeText(data.arbitrationClauseStatus);
  if (arbitrationClauseStatus && arbitrationClauseStatus.length > 200) {
    errors.push("Arbitration clause description cannot exceed 200 characters.");
  }

  // 10. Available Evidence
  const availableEvidence = Array.isArray(data.availableEvidence)
    ? data.availableEvidence.map(sanitizeText).filter(Boolean).join(", ")
    : sanitizeText(data.availableEvidence);
  if (availableEvidence.length > 5000) {
    errors.push("Available evidence summary cannot exceed 5,000 characters.");
  }

  // 11. Missing Evidence / Unverified Documents
  const missingEvidence = sanitizeText(data.missingEvidence);
  if (missingEvidence.length > 5000) {
    errors.push("Missing evidence summary cannot exceed 5,000 characters.");
  }

  // 12. Desired Resolution
  const desiredResolution = sanitizeText(data.desiredResolution);
  if (desiredResolution.length > 1000) {
    errors.push("Desired resolution cannot exceed 1,000 characters.");
  }

  // 13. Mandatory Consent
  if (data.consentAccepted !== true) {
    errors.push("You must accept the mandatory disclaimer acknowledging this is an indicative AI assessment and not legal advice.");
  }

  if (errors.length > 0) {
    return { isValid: false, errors, sanitized: null };
  }

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
      arbitrationClauseStatus: arbitrationClauseStatus || "Silent / Ambiguous Agreement",
      availableEvidence: availableEvidence || "Standard digital communications and commercial records.",
      missingEvidence: missingEvidence || "None specifically identified.",
      desiredResolution: desiredResolution || "Fair commercial settlement or statutory arbitral award.",
      consentAccepted: true
    }
  };
}
