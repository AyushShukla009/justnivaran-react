/**
 * Non-commercial civil — PROCESS GUIDANCE ONLY (until rules are approved).
 *
 * Does NOT use commercial rules: no MSMED Act, no Section 12A Commercial Courts
 * Act, no commercial limitation logic. All legal content is "[to be provided]".
 * To add approved content, fill CONTENT below.
 */

import { buildGuidanceReport, contentFor, validateGuidanceIntake } from "./guidanceShared.js";

export const CATEGORY = "Non-commercial civil";

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
      { value: "residential_tenancy", label: "Residential tenancy / rent" },
      { value: "property_private", label: "Private property or possession" },
      { value: "personal_loan", label: "Money lent between individuals" },
      { value: "consumer", label: "Consumer complaint (goods or services)" },
      { value: "neighbour", label: "Neighbour or housing-society dispute" },
      { value: "injury_negligence", label: "Personal injury or negligence" },
      { value: "other_civil", label: "Other civil matter" }
    ]
  },
  {
    name: "amountBand",
    label: "Approximate amount involved (if any)",
    type: "select",
    required: true,
    options: [
      { value: "none", label: "No money claim" },
      { value: "under_1l", label: "Under ₹1 lakh" },
      { value: "1l_10l", label: "₹1 lakh – ₹10 lakh" },
      { value: "over_10l", label: "Over ₹10 lakh" },
      { value: "unsure", label: "Not sure" }
    ]
  },
  { name: "writtenRecord", label: "Is there any written agreement, receipt or message record?", type: "select", required: true, options: YES_NO_UNSURE },
  { name: "noticeSent", label: "Has a written notice or complaint already been sent?", type: "select", required: true, options: YES_NO_UNSURE },
  { name: "proceedingsFiled", label: "Has any case already been filed by either side?", type: "select", required: true, options: YES_NO_UNSURE },
  { name: "openToMediation", label: "Are you open to mediation?", type: "select", required: true, options: YES_NO_UNSURE },
  {
    name: "briefNote",
    label: "Brief note (optional — do not include names, addresses, phone numbers or ID numbers)",
    type: "textarea",
    required: false,
    maxLength: 800
  }
];

/**
 * Approved content for Non-commercial civil disputes
 * Grounded in the Consumer Protection Act 2019, Negotiable Instruments Act 1881,
 * Transfer of Property Act 1882, Specific Relief Act 1963, Code of Civil Procedure 1908,
 * and landmark Supreme Court precedents from Indian Kanoon:
 * - National Insurance Co. v. Harsolia Motors (2023) 8 SCC 362 (consumer remedies)
 * - Meters and Instruments v. Kanchan Mehta (2018) 1 SCC 560 (digital debt settlement & compounding)
 * - Vidya Drolia v. Durga Trading (2021) 2 SCC 1 (general tenancy arbitrability)
 */
const CONTENT = {
  forum: {
    consumer: [
      "District Consumer Disputes Redressal Commission (District Commission) for claims where value of goods or services paid does not exceed ₹50 Lakhs.",
      "State Consumer Disputes Redressal Commission (State Commission) for claims between ₹50 Lakhs and ₹2 Crores.",
      "National Consumer Disputes Redressal Commission (NCDRC) for claims exceeding ₹2 Crores.",
      "Online complaint filing is available across all commissions via the national E-Daakhil portal (edaakhil.nic.in)."
    ],
    personal_loan: [
      "For dishonoured cheques: Court of Judicial Magistrate First Class / Metropolitan Magistrate under Section 138 of the Negotiable Instruments Act, 1881.",
      "For civil debt: Competent Civil Court (Civil Judge Junior/Senior Division) having territorial jurisdiction where the debtor resides or transaction occurred.",
      "Summary Suit under Order XXXVII of the Code of Civil Procedure, 1908 for expedited debt claims based on written contracts, cheques, or promissory notes."
    ],
    residential_tenancy: [
      "Rent Authority and Rent Tribunal established under State Tenancy Legislation or the Model Tenancy framework.",
      "Civil Court (Small Causes Court / Civil Judge) where specialized rent tribunals are not notified.",
      "Arbitral tribunal where the lease agreement contains an arbitration clause and the tenancy is not governed by state rent control legislation (Vidya Drolia v. Durga Trading (2021) 2 SCC 1 — https://indiankanoon.org/doc/106676100/)."
    ],
    neighbour: [
      "Civil Court for temporary or permanent prohibitory injunction under Section 38 of the Specific Relief Act, 1963 and Order XXXIX Rules 1 & 2 CPC.",
      "Registrar of Cooperative Societies or Housing Society Grievance Redressal Committee for cooperative housing society matters.",
      "Executive Magistrate under Section 133 CrPC / Section 152 BNSS for removal of public nuisance or hazard."
    ],
    property_private: [
      "Civil Court (Civil Judge / District Court) having territorial jurisdiction over the immovable property for declaration of title, possession, or boundary demarcation."
    ],
    default: [
      "Civil Court (Civil Judge Junior/Senior Division or District Court) based on territorial and pecuniary jurisdiction.",
      "Institutional mediation under the Mediation Act, 2023 for consensual dispute resolution."
    ]
  },
  documents: {
    consumer: [
      "Tax invoices, retail cash memos, work orders, or service booking receipts establishing consumer status.",
      "Warranty/guarantee cards, product packaging, and manufacturer instruction manuals.",
      "Written communication, customer care tickets, and formal legal notice specifying deficiency in service or defect in goods.",
      "Technical evaluation or laboratory test report if product defect requires technical confirmation under Section 38(2)(c) of CPA 2019.",
      "Proof of financial loss, replacement expenditure, or injury caused by product defect or service failure."
    ],
    personal_loan: [
      "Original cheque, bank return memo specifying dishonour reason ('Funds Insufficient', 'Account Closed', etc.).",
      "Statutory demand notice issued within 30 days of receipt of the bank return memo.",
      "Registered post / Speed post delivery receipt and internet postal tracking report proving service of the demand notice.",
      "Promissory note, loan agreement, IOU, or bank statement demonstrating fund transfer (NEFT/RTGS/UPI/cheque).",
      "Electronic acknowledgments (WhatsApp messages, SMS, or emails) admitting liability to pay."
    ],
    residential_tenancy: [
      "Executed Lease / Rent Agreement with defined lease tenure, monthly rent, and security deposit terms.",
      "Bank statements or rent receipts proving historical payment and default months.",
      "Notice of tenancy termination under Section 106 of the Transfer of Property Act, 1882 or applicable state tenancy law.",
      "Proof of initial security deposit transfer and property handover inventory / condition photographs."
    ],
    neighbour: [
      "Photographic or video evidence documenting the nuisance, encroachment, leakage, or structural hazard.",
      "Society maintenance records, building bylaws, or property floor plans / ownership deeds.",
      "Written communications, society complaints, or police non-cognizable (NC) complaint acknowledgments."
    ],
    property_private: [
      "Registered sale deed, gift deed, partition deed, or title documents establishing ownership.",
      "Revenue records: Khata / Jamabandi / 7/12 extract, mutation register extracts, and municipal tax receipts.",
      "Boundary demarcation map and possession certificates."
    ],
    default: [
      "Written agreements, invoices, receipts, payment transfer proofs, and communications (emails/messages).",
      "Formal demand notice and postal delivery proof."
    ]
  },
  timeLimits: {
    consumer: [
      "2 years from the date on which the cause of action arose (Section 69 Consumer Protection Act, 2019).",
      "Delay beyond 2 years can only be condoned if sufficient cause is shown to the satisfaction of the Consumer Commission."
    ],
    personal_loan: [
      "For Section 138 NI Act: Demand notice must be dispatched within 30 days of cheque memo. Debtor has 15 days to pay. Complaint must be filed within 30 days following expiry of the 15-day cure window.",
      "For civil suit / Order XXXVII CPC: 3 years from the date of default or from the latest written acknowledgment of debt (statutory limitation rules, Articles 19 & 55)."
    ],
    residential_tenancy: [
      "3 years for recovery of rent arrears under statutory limitation rules (Article 52).",
      "Notice period for eviction: 15 days for monthly tenancy or as stipulated in the executed lease agreement."
    ],
    neighbour: [
      "3 years from the date of encroachment or actionable disturbance; temporary injunction applications should be filed promptly upon threat of injury."
    ],
    property_private: [
      "12 years for recovery of immovable property possession based on proprietary title (Article 65).",
      "3 years for formal declaration of title from when the right to sue first accrues (Article 58)."
    ],
    default: [
      "Generally 3 years for civil contracts and money claims from the date the cause of action arose."
    ]
  },
  whatToExpect: {
    consumer: [
      "Summary adjudication procedure; no mandatory requirement to engage an advocate (complainant can represent in person or through authorized representative).",
      "Commercial entities taking insurance or common services can maintain consumer complaints where the transaction is not for direct profit generation (Supreme Court in National Insurance Co. v. Harsolia Motors (2023) 8 SCC 362 — https://indiankanoon.org/doc/74220992/).",
      "Statutory reliefs: Refund of purchase price, replacement of defective goods, removal of service deficiencies, compensation for harassment, and litigation costs."
    ],
    personal_loan: [
      "Section 138 NI Act proceedings: Judicial Magistrate takes cognizance on sworn affidavit; summons issued to accused.",
      "Judicial compounding standard: Section 138 is primarily compensatory; online digital payment and compounding are permitted to discharge proceedings without incarceration (Supreme Court in Meters and Instruments Pvt. Ltd. v. Kanchan Mehta (2018) 1 SCC 560 — https://indiankanoon.org/doc/160848531/).",
      "Summary civil suit: Summons for judgment served; defendant must obtain leave to defend by showing a genuine triable issue."
    ],
    residential_tenancy: [
      "Rent Tribunal follows summary procedure; statutory grounds for eviction include persistent non-payment of rent, unauthorized subletting, misuse, or bona fide personal requirement.",
      "Tenancy disputes not governed by statutory rent control legislation can proceed to binding arbitration if agreed in contract (Vidya Drolia v. Durga Trading)."
    ],
    neighbour: [
      "Temporary injunction applications evaluated on three classic judicial tests: prima facie case, balance of convenience, and irreparable injury.",
      "Court commissioner may be appointed under Order XXVI Rule 9 CPC for local spot inspection and factual reporting."
    ],
    default: [
      "Civil pleadings (Plaint and Written Statement), document discovery, framing of issues, oral/documentary evidence, and final decree.",
      "Decree executable under Order XXI of the Code of Civil Procedure, 1908."
    ]
  },
  mediation: {
    consumer: [
      "Statutory Consumer Mediation Cells are attached to every District, State, and National Commission under Chapter V of Consumer Protection Act, 2019.",
      "If mediation succeeds, the Consumer Commission passes an order in terms of the settlement, and 100% of the court fee is refunded."
    ],
    personal_loan: [
      "Fast-track institutional mediation is highly recommended for personal debt and cheque disputes to agree on structured installment plans or discounted one-time settlements (OTS).",
      "A mediated settlement agreement compounds the Section 138 offence and avoids criminal court appearances."
    ],
    residential_tenancy: [
      "Mediation resolves security deposit returns, repair obligations, and handover timelines amicably without expensive eviction litigation."
    ],
    neighbour: [
      "Mediation is the single most effective route for neighbour and housing society disputes, preventing ongoing hostility and establishing workable co-existence guidelines."
    ],
    default: [
      "Voluntary institutional mediation under the Mediation Act, 2023 provides a binding settlement agreement enforceable as a court decree without public trial."
    ]
  }
};

export function validate(intake) {
  return validateGuidanceIntake(FIELDS, intake);
}

export function generateGuidance(intake = {}) {
  const m = intake.matterType;
  return buildGuidanceReport({
    module: { label: "Non-commercial civil", category: CATEGORY, fields: FIELDS },
    intake,
    sections: [
      { key: "forum", heading: "Suitable forum", items: contentFor(CONTENT, "forum", m) },
      { key: "documents", heading: "Documents to prepare", items: contentFor(CONTENT, "documents", m) },
      { key: "timeLimits", heading: "Time limits to check", items: contentFor(CONTENT, "timeLimits", m) },
      { key: "whatToExpect", heading: "What to expect", items: contentFor(CONTENT, "whatToExpect", m) },
      { key: "mediation", heading: "Mediation options", items: contentFor(CONTENT, "mediation", m) }
    ]
  });
}

export default { category: CATEGORY, label: "Non-commercial civil", fields: FIELDS, validate, generateGuidance, sensitive: true };
