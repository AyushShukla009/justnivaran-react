/**
 * Curated Server-Side Repository of Verified Indian Legal Authorities
 * Used exclusively by the JustNivaran Legal Outcome AI Predictor
 *
 * NOTE: The LLM receives authority IDs and propositions only.
 * The server maps returned authority IDs strictly back to this trusted source.
 */

export const VERIFIED_LEGAL_AUTHORITIES = {
  AUTH_SAW_PIPES_2003: {
    id: "AUTH_SAW_PIPES_2003",
    caseName: "Oil & Natural Gas Corporation Ltd. v. Saw Pipes Ltd.",
    court: "Supreme Court of India",
    judgmentDate: "2003-04-17",
    citation: "(2003) 5 SCC 705",
    statutorySubject: "Section 73 & 74, Indian Contract Act, 1872",
    legalProposition:
      "Section 74 permits recovery of agreed liquidated damages without proof of actual loss only when genuine pre-estimate of loss exists and actual loss is impossible or difficult to prove; unreasonable penalty terms remain subject to reasonable compensation principles.",
    sourceUrl: "https://indiankanoon.org/doc/171398/",
    verifiedDate: "2026-09-01"
  },
  AUTH_KAILASH_NATH_2015: {
    id: "AUTH_KAILASH_NATH_2015",
    caseName: "Kailash Nath Associates v. Delhi Development Authority & Anr.",
    court: "Supreme Court of India",
    judgmentDate: "2015-01-09",
    citation: "(2015) 4 SCC 136",
    statutorySubject: "Section 74, Indian Contract Act, 1872",
    legalProposition:
      "Under Section 74, compensation is payable only when damage or loss is actually suffered; where loss is capable of being quantified, strict proof of actual loss is mandatory before forfeiture or deduction of milestone payments.",
    sourceUrl: "https://indiankanoon.org/doc/88544975/",
    verifiedDate: "2026-09-01"
  },
  AUTH_ASSOCIATE_BUILDERS_2014: {
    id: "AUTH_ASSOCIATE_BUILDERS_2014",
    caseName: "Associate Builders v. Delhi Development Authority",
    court: "Supreme Court of India",
    judgmentDate: "2014-11-25",
    citation: "(2015) 3 SCC 49",
    statutorySubject: "Section 34(2)(b)(ii), Arbitration and Conciliation Act, 1996",
    legalProposition:
      "The arbitral tribunal is the sole judge of the quality and quantity of evidence; setting aside an award on patent illegality requires the finding to be perverse or shock the conscience of the court (must be read in light of subsequent 2015 statutory amendments and Ssangyong Engineering).",
    sourceUrl: "https://indiankanoon.org/doc/127503906/",
    verifiedDate: "2026-09-01"
  },
  AUTH_SSANGYONG_2019: {
    id: "AUTH_SSANGYONG_2019",
    caseName: "Ssangyong Engineering & Construction Co. Ltd. v. National Highways Authority of India (NHAI)",
    court: "Supreme Court of India",
    judgmentDate: "2019-05-08",
    citation: "(2019) 15 SCC 131",
    statutorySubject: "Section 34(2A), Arbitration and Conciliation Act, 1996",
    legalProposition:
      "Clarified the post-2015 amendment scope of Section 34; patent illegality must appear on the face of the award and go to the root of the matter, without permitting courts to act as appellate bodies or reappreciate evidentiary findings.",
    sourceUrl: "https://indiankanoon.org/doc/165158525/",
    verifiedDate: "2026-09-01"
  },
  AUTH_VIDYA_DROLIA_2020: {
    id: "AUTH_VIDYA_DROLIA_2020",
    caseName: "Vidya Drolia & Ors. v. Durga Trading Corporation",
    court: "Supreme Court of India",
    judgmentDate: "2020-12-14",
    citation: "(2021) 2 SCC 1",
    statutorySubject: "Sections 8 & 11, Arbitration and Conciliation Act, 1996",
    legalProposition:
      "Formulated the four-fold test for non-arbitrability of disputes (actions in rem, sovereign functions, erga omnes effect); standard commercial, contractual, and tenancy claims not governed by specialized statutory rent tribunals are arbitrable.",
    sourceUrl: "https://indiankanoon.org/doc/106676100/",
    verifiedDate: "2026-09-01"
  },
  AUTH_PERKINS_EASTMAN_2019: {
    id: "AUTH_PERKINS_EASTMAN_2019",
    caseName: "Perkins Eastman Architects DPC & Anr. v. HSCC (India) Ltd.",
    court: "Supreme Court of India",
    judgmentDate: "2019-11-26",
    citation: "(2020) 20 SCC 760",
    statutorySubject: "Section 12(5) & Seventh Schedule, Arbitration and Conciliation Act, 1996",
    legalProposition:
      "A person who has an interest in the outcome or decision of the dispute is legally disqualified from unilaterally appointing a sole arbitrator; institutional panels and independent appointments ensure mandatory Section 12(5) neutrality.",
    sourceUrl: "https://indiankanoon.org/doc/60731671/",
    verifiedDate: "2026-09-01"
  },
  AUTH_BCCI_KOCHI_2018: {
    id: "AUTH_BCCI_KOCHI_2018",
    caseName: "Board of Control for Cricket in India v. Kochi Cricket Pvt. Ltd. & Ors.",
    court: "Supreme Court of India",
    judgmentDate: "2018-03-15",
    citation: "(2018) 6 SCC 287",
    statutorySubject: "Section 26, Arbitration and Conciliation (Amendment) Act, 2015",
    legalProposition:
      "Determined the prospective applicability of the Arbitration and Conciliation (Amendment) Act, 2015; statutory procedural timelines apply to arbitral proceedings commenced on or after 23 October 2015 unless parties agree otherwise.",
    sourceUrl: "https://indiankanoon.org/doc/126938988/",
    verifiedDate: "2026-09-01"
  },
  AUTH_ENERGY_WATCHDOG_2017: {
    id: "AUTH_ENERGY_WATCHDOG_2017",
    caseName: "Energy Watchdog v. Central Electricity Regulatory Commission & Ors.",
    court: "Supreme Court of India",
    judgmentDate: "2017-04-11",
    citation: "(2017) 14 SCC 80",
    statutorySubject: "Sections 32 & 56, Indian Contract Act, 1872",
    legalProposition:
      "Under Section 56, commercial difficulty, economic unprofitability, or abnormal rise in market prices does not constitute frustration or force majeure unless the fundamental basis of the contract is completely demolished.",
    sourceUrl: "https://indiankanoon.org/doc/29798084/",
    verifiedDate: "2026-09-01"
  },
  AUTH_BALCO_2012: {
    id: "AUTH_BALCO_2012",
    caseName: "Bharat Aluminium Co. (BALCO) v. Kaiser Aluminium Technical Services Inc.",
    court: "Supreme Court of India",
    judgmentDate: "2012-09-06",
    citation: "(2012) 9 SCC 552",
    statutorySubject: "Section 2(1)(e) & 2(2), Arbitration and Conciliation Act, 1996",
    legalProposition:
      "Established the seat-centric territoriality principle in arbitration; Part I of the Arbitration and Conciliation Act, 1996 applies only when the arbitral seat is situated within India.",
    sourceUrl: "https://indiankanoon.org/doc/1410196/",
    verifiedDate: "2026-09-01"
  },
  AUTH_SILPI_INDUSTRIES_2021: {
    id: "AUTH_SILPI_INDUSTRIES_2021",
    caseName: "Silpi Industries v. Kerala State Road Transport Corporation & Anr.",
    court: "Supreme Court of India",
    judgmentDate: "2021-06-29",
    citation: "(2021) 18 SCC 790",
    statutorySubject: "Sections 15–18, Micro, Small and Medium Enterprises Development (MSMED) Act, 2006",
    legalProposition:
      "The MSMED Act 2006 is a specialized code having overriding statutory effect under Section 24; buyers are statutorily liable for compound interest with monthly rests at 3 times the RBI bank rate under Section 16, and private arbitration clauses yield to Section 18 facilitation proceedings.",
    sourceUrl: "https://indiankanoon.org/doc/162817343/",
    verifiedDate: "2026-09-01"
  },
  AUTH_MAHAKALI_FOODS_2023: {
    id: "AUTH_MAHAKALI_FOODS_2023",
    caseName: "Gujarat State Civil Supplies Corporation Ltd. v. Mahakali Foods Pvt. Ltd. & Anr.",
    court: "Supreme Court of India",
    judgmentDate: "2023-10-31",
    citation: "(2023) 6 SCC 401",
    statutorySubject: "Section 18, MSMED Act 2006 & Section 80 CPC",
    legalProposition:
      "Statutory conciliation and arbitration mechanisms under Section 18 of the MSMED Act prevail over bilateral arbitration agreements; registered MSME suppliers have an indefeasible statutory right to expedited recovery without being impeded by private forum selection clauses.",
    sourceUrl: "https://indiankanoon.org/doc/167230006/",
    verifiedDate: "2026-09-01"
  },
  AUTH_TATA_CYRUS_2021: {
    id: "AUTH_TATA_CYRUS_2021",
    caseName: "Tata Consultancy Services Ltd. v. Cyrus Investments Pvt. Ltd. & Ors.",
    court: "Supreme Court of India",
    judgmentDate: "2021-03-26",
    citation: "(2021) 9 SCC 449",
    statutorySubject: "Sections 241, 242, Companies Act, 2013 & Shareholder Agreements",
    legalProposition:
      "Contractual covenants in Shareholder Agreements (SHAs) and Articles of Association are strictly binding between corporate promoters and investors; tribunals will enforce agreed pre-emption, tag-along, and exit valuation protocols unless tainted by manifest illegality.",
    sourceUrl: "https://indiankanoon.org/doc/178491875/",
    verifiedDate: "2026-09-01"
  },
  AUTH_MD_FROZEN_FOODS_2017: {
    id: "AUTH_MD_FROZEN_FOODS_2017",
    caseName: "M.D. Frozen Foods Exports Pvt. Ltd. & Ors. v. Hero Fincorp Ltd.",
    court: "Supreme Court of India",
    judgmentDate: "2017-09-21",
    citation: "(2017) 16 SCC 741",
    statutorySubject: "SARFAESI Act, 2002 & Section 7, Arbitration and Conciliation Act, 1996",
    legalProposition:
      "Arbitration proceedings and statutory debt/security enforcement mechanisms are cumulative and parallel remedies; lenders and financial institutions are entitled to pursue binding arbitral awards alongside security enforcement.",
    sourceUrl: "https://indiankanoon.org/doc/118872223/",
    verifiedDate: "2026-09-01"
  }
};

/**
 * Returns a compact prompt representation for the Gemini model
 */
export function getAuthoritiesPromptSummary() {
  return Object.values(VERIFIED_LEGAL_AUTHORITIES)
    .map(
      (auth) =>
        `[ID: ${auth.id}] ${auth.caseName}, ${auth.citation} (${auth.court}). Proposition: ${auth.legalProposition}`
    )
    .join("\n\n");
}

/**
 * Filters and validates model-returned authority IDs against our trusted repository
 */
export function resolveVerifiedAuthorities(authoritiesFromModel) {
  if (!Array.isArray(authoritiesFromModel)) return [];

  const matched = [];
  const seenIds = new Set();

  for (const item of authoritiesFromModel) {
    const rawId = typeof item === "string" ? item : item?.authorityId || item?.id;
    if (!rawId || seenIds.has(rawId)) continue;

    const trusted = VERIFIED_LEGAL_AUTHORITIES[rawId];
    if (trusted) {
      seenIds.add(rawId);
      matched.push({
        authorityId: trusted.id,
        caseName: trusted.caseName,
        court: trusted.court,
        judgmentDate: trusted.judgmentDate,
        citation: trusted.citation,
        statutorySubject: trusted.statutorySubject,
        legalProposition: trusted.legalProposition,
        sourceUrl: trusted.sourceUrl,
        applicationToDispute:
          typeof item === "object" && item?.applicationToDispute
            ? String(item.applicationToDispute).slice(0, 500)
            : "Directly applicable to the material legal issues identified in the dispute chronology.",
        verifiedDate: trusted.verifiedDate
      });
    }
  }

  return matched;
}
