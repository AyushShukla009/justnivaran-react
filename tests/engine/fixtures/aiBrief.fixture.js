/**
 * TEST FIXTURE: builds a compliant v2 (neutral brief) AI response for a given
 * deterministic report, the way a well-behaved model would answer.
 */
export function compliantAIBrief(det, overrides = {}) {
  return {
    statement_of_facts:
      "The claimant states that goods or services were supplied under the contract and that payment has not been made. The respondent has not been heard.",
    issues: det.brief.issues.map((i) => ({
      issue_id: i.id,
      claimant_position: i.claimantPosition,
      respondent_position: i.respondentPosition,
      analysis: `The issue is governed by ${i.applicableLaw[0]}. Its determination depends on the documents listed against it.`,
      evidence_needed: ["Original documents relied upon by the claimant."]
    })),
    additional_issues: [],
    evidence_gaps: ["Proof of service of notice."],
    assumptions: [],
    procedural_next_steps: ["Serve a written notice stating the claim.", "Collect the documents listed against each issue."],
    ...overrides
  };
}
