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

const CONTENT = {
  forum: {},
  documents: {},
  whatToExpect: {},
  mediation: {}
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
