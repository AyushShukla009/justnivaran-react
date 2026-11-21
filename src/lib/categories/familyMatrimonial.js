/**
 * Family / Matrimonial (including divorce) — PROCESS GUIDANCE ONLY.
 *
 * No strength ratings, outcome scenarios, settlement outlook or recovery
 * predictions — ever. All legal content is "[to be provided]" until approved.
 * To add approved content, fill CONTENT below (per section, keyed by matterType
 * or `default`); each value is a list of short points.
 */

import { buildGuidanceReport, contentFor, validateGuidanceIntake } from "./guidanceShared.js";

export const CATEGORY = "Family / Matrimonial (including divorce)";

const YES_NO_UNSURE = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" }
];

export const FIELDS = [
  {
    name: "matterType",
    label: "What is the matter about?",
    type: "select",
    required: true,
    options: [
      { value: "divorce_mutual", label: "Divorce — by mutual consent" },
      { value: "divorce_contested", label: "Divorce — contested" },
      { value: "maintenance", label: "Maintenance / financial support" },
      { value: "custody", label: "Child custody or visitation" },
      { value: "domestic_violence", label: "Protection from domestic violence" },
      { value: "other_family", label: "Other family matter" }
    ]
  },
  {
    name: "personalLaw",
    label: "Law under which the marriage was solemnised or registered",
    type: "select",
    required: true,
    options: [
      { value: "hindu", label: "Hindu Marriage Act, 1955" },
      { value: "special", label: "Special Marriage Act, 1954" },
      { value: "muslim", label: "Muslim personal law" },
      { value: "christian", label: "Indian Divorce Act, 1869 (Christian)" },
      { value: "parsi", label: "Parsi Marriage and Divorce Act, 1936" },
      { value: "other", label: "Other" },
      { value: "unsure", label: "Not sure" }
    ]
  },
  { name: "childrenInvolved", label: "Are children involved?", type: "select", required: true, options: YES_NO_UNSURE },
  { name: "proceedingsFiled", label: "Has any case already been filed by either side?", type: "select", required: true, options: YES_NO_UNSURE },
  { name: "openToMediation", label: "Are you open to mediation or counselling?", type: "select", required: true, options: YES_NO_UNSURE },
  { name: "safetyConcern", label: "Is anyone at immediate risk of harm?", type: "select", required: true, options: YES_NO_UNSURE },
  {
    name: "briefNote",
    label: "Brief note (optional — do not include names, addresses, phone numbers, ID numbers, children's details or health information)",
    type: "textarea",
    required: false,
    maxLength: 800
  }
];

/**
 * Approved content for Family / Matrimonial (including divorce)
 * Grounded in the Hindu Marriage Act 1955, Special Marriage Act 1954,
 * Family Courts Act 1984, Guardians and Wards Act 1890, PWDVA 2005,
 * and landmark Supreme Court precedents from Indian Kanoon:
 * - Amardeep Singh v. Harveen Kaur (2017) 8 SCC 746 (cooling-off waiver)
 * - Rajnesh v. Neha (2021) 2 SCC 324 (maintenance guidelines & disclosure)
 * - K. Srinivas Rao v. D.A. Deepa (2013) 5 SCC 226 (matrimonial mediation)
 */
const CONTENT = {
  forum: {
    divorce_mutual: [
      "Family Court established under the Family Courts Act, 1984 having territorial jurisdiction where the marriage was solemnised, where both parties last resided together, or where the wife resides.",
      "Governed by Section 13B of the Hindu Marriage Act, 1955 or Section 28 of the Special Marriage Act, 1954."
    ],
    divorce_contested: [
      "Family Court having territorial jurisdiction under the applicable personal law (Section 19 Hindu Marriage Act, 1955 or Section 31 Special Marriage Act, 1954).",
      "In judicial districts where no specialized Family Court is established, the Principal District Court / Civil Judge."
    ],
    maintenance: [
      "Family Court or Court of Judicial Magistrate First Class (JMFC) / Metropolitan Magistrate under Section 125 Code of Criminal Procedure (CrPC) / Section 144 BNSS.",
      "Civil applications for pendente lite or permanent alimony before the Family Court under Section 24 and Section 25 of the Hindu Marriage Act, 1955.",
      "Magistrate Court under Section 20 and Section 22 of the Protection of Women from Domestic Violence Act, 2005 (PWDVA)."
    ],
    custody: [
      "Family Court or Principal District Court exercising jurisdiction under the Guardians and Wards Act, 1890 and the Hindu Minority and Guardianship Act, 1956.",
      "Jurisdiction lies exclusively before the court where the minor child ordinarily resides."
    ],
    domestic_violence: [
      "Court of Judicial Magistrate First Class / Metropolitan Magistrate under the Protection of Women from Domestic Violence Act, 2005 (PWDVA).",
      "Jurisdiction covers the place where the aggrieved person resides permanently or temporarily, where the respondent resides, or where the domestic violence occurred."
    ],
    default: [
      "Family Court established under the Family Courts Act, 1984 having territorial jurisdiction over matrimonial causes.",
      "District Court / Civil Judge Senior Division where no specialized Family Court is constituted."
    ]
  },
  documents: {
    divorce_mutual: [
      "Original marriage registration certificate or wedding invitation card with affidavit and joint photograph.",
      "Identity proof (Aadhaar / Voter ID / Passport) and residential address proof of both spouses.",
      "Proof of living separately for at least one year immediately preceding filing (e.g. separate rental deeds, utility records).",
      "Executed Joint Settlement Agreement / Memorandum of Understanding (MoU) recording mutual agreement on permanent alimony, return of stridhan, and child custody/visitation terms.",
      "Passport-size photographs and joint petition signed by both parties."
    ],
    divorce_contested: [
      "Marriage registration certificate or documentary evidence of marriage solemnisation.",
      "Chronological documentary evidence establishing statutory grounds (cruelty, desertion for ≥ 2 years, adultery, mental illness, conversion).",
      "Written communication, notices, medical records, or complaints previously exchanged.",
      "Income disclosure affidavit and current residential proof."
    ],
    maintenance: [
      "Mandatory Affidavit of Disclosure of Assets and Liabilities by both spouses (as mandated by the Supreme Court of India in Rajnesh v. Neha (2021) 2 SCC 324 — https://indiankanoon.org/doc/117541087/).",
      "Income Tax Returns (ITR) with computation of income for the last 3 financial years.",
      "Bank account statements of all active accounts for the past 12 to 36 months.",
      "Salary slips (last 6 months) or audited financial statements / GST returns for self-employed/business professionals.",
      "Documentary proof of dependent children's educational and medical expenditures."
    ],
    custody: [
      "Child's birth certificate and school admission / progress records.",
      "Medical records, proof of schooling, and documents proving the living environment of the custodian parent.",
      "Proof of financial capacity to provide maintenance, healthcare, and education for the child.",
      "Proof of the child's ordinary residence."
    ],
    domestic_violence: [
      "Detailed chronological narrative or diary of domestic incident dates and locations.",
      "Medical examination reports, hospital discharge summaries, or MLC records if physical injury occurred.",
      "Domestic Incident Report (DIR) prepared by the Protection Officer or registered service provider.",
      "Photographs, audio/video recordings, WhatsApp/SMS records, or police complaints / NCR filings.",
      "Proof of shared household (rental agreement, ownership deeds, or utility bills)."
    ],
    default: [
      "Proof of solemnisation of marriage (registration certificate or wedding card with affidavit).",
      "Identity and residential address proofs of both parties.",
      "Chronological factual records and any prior settlement agreements or legal notices."
    ]
  },
  whatToExpect: {
    divorce_mutual: [
      "First Motion: Joint petition presented and parties' statements recorded on oath before the Family Court judge.",
      "Cooling-Off Period: Statutory 6-month period between First and Second Motion under Section 13B(2) of Hindu Marriage Act, 1955.",
      "Waiver of 6 Months: The cooling-off period can be waived upon application if all issues (alimony, custody, stridhan) are settled and further cohabitation is impossible, pursuant to Supreme Court landmark Amardeep Singh v. Harveen Kaur (2017) 8 SCC 746 (https://indiankanoon.org/doc/79830357/).",
      "Second Motion: Parties reaffirm consent; final decree of divorce by mutual consent is issued upon satisfaction of the court."
    ],
    divorce_contested: [
      "Filing of petition, issuance of summons, and mandatory reference to court-annexed mediation at the initial appearance.",
      "Filing of written statement, framing of issues, claimant and respondent evidence (examination-in-chief via affidavit and cross-examination).",
      "Final oral arguments and judgment. Contested proceedings typically span 18 to 36 months depending on court docket and evidence."
    ],
    maintenance: [
      "Interim Maintenance: Adjudicated within 60 to 90 days based on the mandatory Affidavits of Assets and Liabilities (Rajnesh v. Neha guidelines).",
      "Determination criteria: Standard of living during marriage, reasonable needs of applicant and children, independent income of applicant, and net earning capacity of respondent.",
      "Enforcement: Maintenance orders are enforceable through salary attachment, civil detention, or recovery as land revenue under Section 125(3) CrPC."
    ],
    custody: [
      "Guiding legal principle: The paramount welfare of the minor child is the sole decisive criterion, superseding statutory parent rights.",
      "Interim custody and structured visitation rights (in-person, telephonic, video, weekend, or holiday access) established early in proceedings.",
      "Child interaction: The Family Court judge or child counsellor may interact with the child in chambers to ascertain preference if of sufficient maturity."
    ],
    domestic_violence: [
      "Initial hearing within 3 days of application receipt by the Magistrate.",
      "Immediate ex-parte orders: Protection orders prohibiting violence (S. 18), residence orders securing roof in shared household (S. 19).",
      "Monetary relief (S. 20) and compensation (S. 22) adjudicated; statutory aim is disposal within 60 days from the first hearing."
    ],
    default: [
      "Initial appearance and mandatory referral to exploratory counselling or court-annexed mediation under Section 9 of the Family Courts Act, 1984.",
      "Procedural timelines governed by Code of Civil Procedure, 1908 as modified by Family Courts Act procedures."
    ]
  },
  mediationCounselling: {
    divorce_mutual: [
      "Institutional mediation helps parties negotiate a binding, equitable Memorandum of Understanding (MoU) resolving child custody schedules, alimony quantum, and asset division before filing the joint petition.",
      "A clean mediated MoU eliminates contested litigation and enables waiver of the statutory cooling-off period."
    ],
    divorce_contested: [
      "Mandatory statutory mediation under Section 9 of the Family Courts Act, 1984. Courts have a positive duty to assist parties in exploring reconciliation or an amicable consensual settlement (K. Srinivas Rao v. D.A. Deepa (2013) 5 SCC 226 — https://indiankanoon.org/doc/14713882/).",
      "Parties can convert contested proceedings into mutual consent divorce at any stage following a successful mediation settlement."
    ],
    maintenance: [
      "Pre-litigation and pendente lite mediation provides a private forum to calculate realistic, sustainable maintenance figures without adversarial hostility.",
      "Mediation settlement agreements can provide for lump-sum one-time settlement or indexed monthly alimony with formal court approval."
    ],
    custody: [
      "Child-centric family mediation with experienced neutral facilitators creates practical, co-parenting and holiday visitation schedules that serve the child's emotional stability."
    ],
    domestic_violence: [
      "Mediation can be explored voluntarily only when the aggrieved person is safe from coercion and after immediate protection orders are secured.",
      "Mediation focuses on long-term safety, residential arrangements, and independent financial maintenance."
    ],
    default: [
      "Private institutional mediation under the Mediation Act, 2023 offers complete confidentiality and privacy, shielding sensitive personal and family details from public court records.",
      "Mediated settlement agreements arrived at with both parties' consent are final, binding, and enforceable in law."
    ]
  }
};

export function validate(intake) {
  return validateGuidanceIntake(FIELDS, intake);
}

export function generateGuidance(intake = {}) {
  const m = intake.matterType;
  const notices = [];
  if (intake.safetyConcern === "yes") {
    notices.push("If anyone is in immediate danger, call 112 (India emergency number) now. Online guidance cannot help in an emergency.");
  }

  return buildGuidanceReport({
    module: { label: "Family / Matrimonial", category: CATEGORY, fields: FIELDS },
    intake,
    notices,
    sections: [
      { key: "forum", heading: "Suitable forum", items: contentFor(CONTENT, "forum", m) },
      { key: "documents", heading: "Documents to prepare", items: contentFor(CONTENT, "documents", m) },
      { key: "whatToExpect", heading: "What to expect", items: contentFor(CONTENT, "whatToExpect", m) },
      { key: "mediationCounselling", heading: "Mediation and counselling options", items: contentFor(CONTENT, "mediationCounselling", m) }
    ]
  });
}

export default { category: CATEGORY, label: "Family / Matrimonial", fields: FIELDS, validate, generateGuidance, sensitive: true };
