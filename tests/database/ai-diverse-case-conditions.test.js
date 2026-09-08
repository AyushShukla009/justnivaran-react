import assert from "node:assert";
import { generateInstitutionalAssessment } from "../../src/lib/institutionalEngine.js";

console.log("=================================================================");
console.log("   TESTING DIVERSE CASE CONDITIONS & DYNAMIC LEGAL OUTCOMES      ");
console.log("=================================================================\n");

// Case 1: MSME Delayed Payments (₹4.5L)
console.log("--> Case 1: MSME Delayed Payments (₹4.5 Lakhs)...");
const msmeCase = {
  category: "MSME Delayed Payments (MSMED Act 2006)",
  claimValue: 450000,
  breachDetails: "Non-payment for industrial gearboxes beyond statutory 45-day credit window under Section 15 MSMED Act.",
  expectedDefenses: "Buyer alleges delayed delivery and seeks waiver of compound interest."
};
const msmeReport = generateInstitutionalAssessment(msmeCase);

assert.ok(msmeReport.assessmentSummary.includes("MSMED Act"), "Summary cites MSMED Act");
assert.ok(msmeReport.assessmentSummary.includes("4,50,000"), "Summary has ₹4.5L quantum");
assert.ok(msmeReport.relevantStatutes.some(s => s.includes("MSMED")), "Statutes contain MSMED Act");
assert.ok(msmeReport.legalIssues.some(i => i.issueTitle.includes("Section 16")), "Issue includes Section 16 compound interest");
assert.ok(msmeReport.verifiedAuthorities.some(a => a.authorityId.includes("SILPI") || a.authorityId.includes("MAHAKALI")), "Contains Silpi Industries / Mahakali Foods");
console.log("    [PASS] MSME case generates category-specific statutes, issues & Supreme Court precedents.");

// Case 2: Construction & EPC Delay (₹50L)
console.log("\n--> Case 2: Construction & EPC Delay (₹50 Lakhs)...");
const epcCase = {
  category: "Construction, EPC & Infrastructure Delays",
  claimValue: 5000000,
  breachDetails: "Withholding of RA Bill 7 and unilateral imposition of liquidated damages for site delay.",
  expectedDefenses: "Employer claims critical path delay and liquidated damages of 10% contract value."
};
const epcReport = generateInstitutionalAssessment(epcCase);

assert.ok(epcReport.assessmentSummary.includes("infrastructure"), "Summary identifies EPC/infrastructure context");
assert.ok(epcReport.assessmentSummary.includes("50,00,000"), "Summary has ₹50L quantum");
assert.ok(epcReport.legalIssues.some(i => i.issueTitle.includes("Liquidated Damages") || i.issueTitle.includes("Hindrance")), "Issue identifies liquidated damages & hindrance");
assert.ok(epcReport.verifiedAuthorities.some(a => a.authorityId.includes("KAILASH_NATH") || a.authorityId.includes("SSANGYONG")), "Contains Ssangyong / Kailash Nath");
console.log("    [PASS] Construction case generates distinct EPC delay apportionment analysis.");

// Case 3: IT Services & Software SLA (₹10L)
console.log("\n--> Case 3: IT Services & Software SLA (₹10 Lakhs)...");
const itCase = {
  category: "IT Services, Software SLA & Technology Licensing",
  claimValue: 1000000,
  breachDetails: "Client deployed SaaS software to production but refuses milestone 3 payment alleging minor bug tickets.",
  expectedDefenses: "Client alleges SLA downtime and demands source code repository access."
};
const itReport = generateInstitutionalAssessment(itCase);

assert.ok(itReport.assessmentSummary.includes("IT") || itReport.assessmentSummary.includes("software"), "Summary identifies IT SLA context");
assert.ok(itReport.legalIssues.some(i => i.issueTitle.includes("UAT") || i.issueTitle.includes("Limitation of Liability")), "Identifies UAT deemed acceptance & liability cap");
console.log("    [PASS] IT case generates distinct software UAT deemed acceptance & SLA analysis.");

// Case 4: Commercial Lease (₹25L)
console.log("\n--> Case 4: Commercial Lease & Real Estate (₹25 Lakhs)...");
const leaseCase = {
  category: "Commercial Lease & Real Estate Development",
  claimValue: 2500000,
  breachDetails: "Landlord refuses to refund interest-free security deposit of ₹25L after tenant vacated premises upon Section 106 notice.",
  expectedDefenses: "Landlord claims dilapidation restoration expenses and unpaid utilities."
};
const leaseReport = generateInstitutionalAssessment(leaseCase);

assert.ok(leaseReport.assessmentSummary.includes("lease") || leaseReport.assessmentSummary.includes("tenancy"), "Summary identifies lease context");
assert.ok(leaseReport.relevantStatutes.some(s => s.includes("Transfer of Property Act")), "Contains Transfer of Property Act");
assert.ok(leaseReport.verifiedAuthorities.some(a => a.authorityId.includes("VIDYA_DROLIA")), "Contains Vidya Drolia on tenancy arbitrability");
console.log("    [PASS] Lease case generates distinct TP Act Section 106 & security deposit refund analysis.");

// Verify Outputs are Distinct across cases
console.log("\n--> Case Comparison: Verifying outputs are strictly distinct across cases...");
assert.notStrictEqual(msmeReport.assessmentSummary, epcReport.assessmentSummary, "Summaries must be different");
assert.notStrictEqual(msmeReport.assessmentSummary, itReport.assessmentSummary, "Summaries must be different");
assert.notStrictEqual(msmeReport.assessmentSummary, leaseReport.assessmentSummary, "Summaries must be different");
assert.notStrictEqual(msmeReport.legalIssues[0].issueTitle, epcReport.legalIssues[0].issueTitle, "Issue 1 must be different");
assert.notStrictEqual(msmeReport.legalIssues[0].issueTitle, itReport.legalIssues[0].issueTitle, "Issue 1 must be different");
assert.notStrictEqual(msmeReport.relevantStatutes[0], leaseReport.relevantStatutes[0], "Statutes must be different");
console.log("    [PASS] Every case condition yields a completely customized, distinct, domain-accurate dossier.");

console.log("\n=================================================================");
console.log("   ALL DIVERSE CASE CONDITION TESTS PASSED (100%)                ");
console.log("=================================================================\n");
