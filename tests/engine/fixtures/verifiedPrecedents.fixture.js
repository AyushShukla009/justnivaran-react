/**
 * TEST FIXTURE ONLY — not production data and not a legal verification.
 *
 * Simulates the case-bank retrieval layer having returned these precedents for a
 * request with verified: true, so validator tests can exercise the "allowed"
 * path. Production citability is controlled solely by src/data/cases.json.
 */
export const TEST_VERIFIED_PRECEDENTS = [
  "Patil Automation Pvt. Ltd. & Ors. v. Rakheja Engineers Pvt. Ltd. (2022) 10 SCC 1",
  "Silpi Industries etc. v. Kerala State Road Transport Corporation & Anr. (2021) SCC OnLine SC 439",
  "Gujarat State Civil Supplies Corporation Ltd. v. Mahakali Foods Pvt. Ltd. & Anr. (2023) 6 SCC 401",
  "Kailash Nath Associates v. Delhi Development Authority & Anr. (2015) 4 SCC 136",
  "Oil & Natural Gas Corporation Ltd. v. Saw Pipes Ltd. (2003) 5 SCC 705"
].map((citation) => ({
  citation,
  court: "TEST FIXTURE",
  year: "",
  subject: "test fixture",
  holding: "test fixture",
  source_link: "",
  verified: true
}));
