/**
 * Registry of guidance-only predictor categories (Task 16).
 * Commercial categories are NOT listed here and keep using deterministicEngine.js.
 */

import familyMatrimonial from "./familyMatrimonial.js";
import nonCommercialCivil from "./nonCommercialCivil.js";
import miscellaneous from "./miscellaneous.js";

export const GUIDANCE_MODULES = [familyMatrimonial, nonCommercialCivil, miscellaneous];

const BY_CATEGORY = new Map(GUIDANCE_MODULES.map((m) => [m.category, m]));

export function getGuidanceModule(category) {
  return BY_CATEGORY.get(category) || null;
}

export function isGuidanceCategory(category) {
  return BY_CATEGORY.has(category);
}
