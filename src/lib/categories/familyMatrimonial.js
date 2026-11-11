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
 * Approved content goes here. Everything absent renders as "[to be provided]".
 * Shape: CONTENT[sectionKey][matterType | "default"] = ["point", ...]
 */
const CONTENT = {
  forum: {},
  documents: {},
  whatToExpect: {},
  mediationCounselling: {}
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
