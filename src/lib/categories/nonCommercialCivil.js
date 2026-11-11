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

const CONTENT = {
  forum: {},
  documents: {},
  timeLimits: {},
  whatToExpect: {},
  mediation: {}
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
