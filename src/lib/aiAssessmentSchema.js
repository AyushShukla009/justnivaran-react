/**
 * Zod Schema for the AI layer of the Neutral Case Brief (v2)
 *
 * The AI drafts neutral analysis for the issues the rules engine has framed.
 * It produces NO outcome predictions: no strength ratings, likelihoods,
 * scenarios, settlement outlook or recovery estimates.
 */

import { z } from "zod";

const text = (min = 1) => z.string().trim().min(min);

export const AIIssueAnalysisSchema = z.object({
  issue_id: text(),
  claimant_position: text(),
  respondent_position: text(),
  analysis: text(20),
  evidence_needed: z.array(text()).default([])
});

export const AIAdditionalIssueSchema = z.object({
  issue: text(10),
  claimant_position: text(),
  respondent_position: text(),
  applicable_law: z.array(text()).default([]),
  analysis: text(20),
  evidence_needed: z.array(text()).default([])
});

export const AIAssessmentResponseSchema = z.object({
  statement_of_facts: text(20),
  issues: z.array(AIIssueAnalysisSchema).min(1, "Analysis is required for the framed issues."),
  additional_issues: z.array(AIAdditionalIssueSchema).max(2).default([]),
  evidence_gaps: z.array(text()).default([]),
  assumptions: z.array(text()).default([]),
  procedural_next_steps: z.array(text()).min(1, "At least one procedural step is required.")
});
