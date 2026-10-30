/**
 * JustNivaran Institutional Legal Assessment Endpoint (/api/legal-outcome)
 * Canonical endpoint for dispute assessment, powered strictly by Anthropic Claude
 * and the Deterministic Statutory Legal Engine.
 *
 * Groq and Gemini fallbacks removed per user instruction.
 */

import handler, { executeAssessment } from "./assess.js";
import { generateInstitutionalAssessment } from "../src/lib/institutionalEngine.js";

export { executeAssessment, generateInstitutionalAssessment };
export default handler;
