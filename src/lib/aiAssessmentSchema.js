/**
 * Zod Schema for Institutional AI Dispute Assessment Output
 * Enforces strict structure, qualitative ratings (Strong/Moderate/Weak only),
 * settlement outlook enum (NO percentages, NO rupee settlement figures from AI),
 * and prevents hallucinated or malformed JSON responses.
 */

import { z } from "zod";

export const SettlementOutlookRatingEnum = z.enum([
  "Full recovery likely",
  "Substantial partial recovery likely",
  "Partial recovery likely",
  "Uncertain"
]);

export const AIAssessmentResponseSchema = z.object({
  case_summary: z
    .string()
    .min(20, "Case summary must provide a concise factual synthesis."),

  claim_strength: z.object({
    rating: z.enum(["Strong", "Moderate", "Weak"]),
    reasons: z.array(z.string()).min(1, "At least one claim strength reason required.")
  }),

  defence_strength: z.object({
    rating: z.enum(["Strong", "Moderate", "Weak"]),
    reasons: z.array(z.string()).min(1, "At least one defence strength reason required.")
  }),

  key_legal_issues: z
    .array(z.string())
    .min(2, "Must identify at least two key legal issues."),

  applicable_principles: z
    .array(
      z.object({
        name: z.string(),
        why_relevant: z.string()
      })
    )
    .min(1, "Must list applicable statutory principles."),

  evidence_gaps: z.array(z.string()),

  risks: z.array(z.string()).min(1, "Must identify key litigation / dispute risks."),

  likely_outcome_scenarios: z
    .array(
      z.object({
        scenario: z.string(),
        likelihood: z.enum(["High", "Medium", "Low"]),
        explanation: z.string()
      })
    )
    .min(2, "Must outline at least two probable outcome scenarios."),

  // Judicial requirement: Qualitative settlement outlook only (NO percentages, NO rupee figures from AI)
  settlement_outlook: z.object({
    rating: SettlementOutlookRatingEnum,
    explanation: z.string().min(10, "One-line settlement outlook explanation required.")
  }),

  recommended_next_steps: z
    .array(z.string())
    .min(2, "Must provide actionable institutional next steps."),

  confidence: z.enum(["High", "Moderate", "Low"]),

  assumptions: z.array(z.string())
});
