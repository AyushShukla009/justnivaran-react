/**
 * Miscellaneous — PROCESS GUIDANCE ONLY (until rules are approved).
 *
 * Does NOT use commercial rules: no MSMED Act, no Section 12A Commercial Courts
 * Act, no commercial limitation logic. All legal content is "[to be provided]".
 * To add approved content, fill CONTENT below.
 */

import { buildGuidanceReport, contentFor, validateGuidanceIntake } from "./guidanceShared.js";

export const CATEGORY = "Miscellaneous";

const YES_NO_UNSURE = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" }
];

export const FIELDS = [
  {
    name: "partiesType",
    label: "Who is the dispute between?",
    type: "select",
    required: true,
    options: [
      { value: "individuals", label: "Individuals" },
      { value: "individual_org", label: "An individual and an organisation" },
      { value: "organisations", label: "Organisations" },
      { value: "unsure", label: "Not sure" }
    ]
  },
  {
    name: "reliefSought",
    label: "What outcome are you looking for?",
    type: "select",
    required: true,
    options: [
      { value: "money", label: "Payment of money" },
      { value: "action", label: "Someone to do or stop doing something" },
      { value: "documents", label: "Return of documents or property" },
      { value: "apology_settlement", label: "Apology or amicable settlement" },
      { value: "unsure", label: "Not sure" }
    ]
  },
  { name: "writtenRecord", label: "Is there any written record of the dispute?", type: "select", required: true, options: YES_NO_UNSURE },
  { name: "proceedingsFiled", label: "Has any case already been filed by either side?", type: "select", required: true, options: YES_NO_UNSURE },
  { name: "openToMediation", label: "Are you open to mediation?", type: "select", required: true, options: YES_NO_UNSURE },
  {
    name: "briefNote",
    label: "Describe the matter briefly (do not include names, addresses, phone numbers or ID numbers)",
    type: "textarea",
    required: true,
    maxLength: 800
  }
];

/**
 * Approved content for Miscellaneous disputes
 * Grounded in the Code of Civil Procedure 1908 (Section 89 ADR referrals),
 * Specific Relief Act 1963, and the Mediation Act 2023,
 * backed by landmark Supreme Court authority from Indian Kanoon:
 * - Afcons Infrastructure Ltd. v. Cherian Varkey Construction Co. (2010) 8 SCC 24 (ADR suitability taxonomy)
 */
const CONTENT = {
  forum: {
    money: [
      "Civil Court having territorial and pecuniary jurisdiction (Civil Judge Junior/Senior Division or District Court).",
      "Institutional Civil Mediation under the Mediation Act, 2023 for consensual resolution without protracted litigation.",
      "Arbitration Tribunal if an arbitration clause or post-dispute submission agreement exists between the parties."
    ],
    action: [
      "Civil Court for a decree of specific performance under the Specific Relief Act, 1963 or permanent prohibitory/mandatory injunction.",
      "Statutory Regulatory Authority (e.g. RERA, Electricity Ombudsman, Registrar) where the dispute falls within a specialized statutory domain."
    ],
    documents: [
      "Civil Court for recovery of specific movable property or title documents under Sections 7 & 8 of the Specific Relief Act, 1963.",
      "Magistrate Court or Police Grievance Cell where wrongful withholding involves breach of trust or criminal misappropriation."
    ],
    apology_settlement: [
      "Institutional Mediation Centre under the Mediation Act, 2023 or Court-Annexed Mediation Centre under Section 89 of the Code of Civil Procedure, 1908.",
      "Civil Court for civil defamation or restitution of dignity."
    ],
    default: [
      "Competent Civil Court having pecuniary and territorial jurisdiction under the Code of Civil Procedure, 1908.",
      "Institutional Mediation Centre under the Mediation Act, 2023."
    ]
  },
  documents: {
    money: [
      "Contracts, invoices, receipts, work completion letters, or promissory notes.",
      "Bank transfer records (NEFT/RTGS/UPI/bank ledger statements).",
      "Written communications, demand notices, and responses."
    ],
    action: [
      "Underlying agreement, terms of engagement, or bylaws defining the obligation to act or refrain from acting.",
      "Written reminders, notices of default, and photographic or documentary proof of non-compliance."
    ],
    documents: [
      "Proof of ownership, original dispatch receipt, or custodial acknowledgment.",
      "Written demands seeking return of documents or property."
    ],
    apology_settlement: [
      "Copies of offending statements, correspondence, or chronological summary of the grievance.",
      "Records of past mutual interactions and outline of proposed settlement terms."
    ],
    default: [
      "All written agreements, correspondence, notices, and financial transaction records."
    ]
  },
  whatToExpect: {
    money: [
      "Assessment of cause of action and statutory limitation periods (generally 3 years for civil claims).",
      "Exploration of ADR under Section 89 CPC; courts have a positive statutory duty to refer suitable civil matters to mediation or conciliation (Supreme Court ruling in Afcons Infrastructure Ltd. v. Cherian Varkey (2010) 8 SCC 24 — https://indiankanoon.org/doc/184994687/)."
    ],
    action: [
      "Evaluation of statutory criteria under Specific Relief Act, 1963: whether damages offer adequate relief or specific performance is necessary.",
      "Interim injunction considerations: prima facie case, balance of convenience, and irreparable injury."
    ],
    documents: [
      "Immediate directional orders or interim custody orders during proceedings.",
      "Examination of lien claims or security rights asserted by the holder."
    ],
    apology_settlement: [
      "Non-adversarial, interest-based dialogue facilitated by a neutral mediator.",
      "Flexible settlement solutions including mutual apologies, non-disparagement covenants, and restructured relationship terms."
    ],
    default: [
      "Procedural steps governed by the Code of Civil Procedure, 1908; judicial exploration of settlement options under Section 89 CPC."
    ]
  },
  mediation: {
    money: [
      "Institutional mediation allows parties to structure flexible payment installments, discounts, or mutually beneficial commercial trade-offs without adversarial delay."
    ],
    action: [
      "Mediation enables tailored commitments, milestones, and reciprocal performance terms that a court decree cannot easily formulate."
    ],
    documents: [
      "Safe, neutral handover protocols can be structured in mediation with mutual release of claims."
    ],
    apology_settlement: [
      "Mediation is the ideal and preferred forum for relationship-sensitive disputes, offering absolute confidentiality and restorative solutions without public trial."
    ],
    default: [
      "Under the Mediation Act, 2023, mediated settlement agreements reached through institutional mediation are final, binding, and executable in the same manner as a court decree."
    ]
  }
};

export function validate(intake) {
  return validateGuidanceIntake(FIELDS, intake);
}

export function generateGuidance(intake = {}) {
  const key = intake.reliefSought;
  return buildGuidanceReport({
    module: { label: "Miscellaneous", category: CATEGORY, fields: FIELDS },
    intake,
    sections: [
      { key: "forum", heading: "Possible forums", items: contentFor(CONTENT, "forum", key) },
      { key: "documents", heading: "Documents to prepare", items: contentFor(CONTENT, "documents", key) },
      { key: "whatToExpect", heading: "What to expect", items: contentFor(CONTENT, "whatToExpect", key) },
      { key: "mediation", heading: "Mediation options", items: contentFor(CONTENT, "mediation", key) }
    ]
  });
}

export default { category: CATEGORY, label: "Miscellaneous", fields: FIELDS, validate, generateGuidance, sensitive: true };
