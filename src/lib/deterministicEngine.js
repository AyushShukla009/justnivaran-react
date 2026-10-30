/**
 * JustNivaran Deterministic Legal & Statutory Rules Engine
 * Plain JavaScript rules module — zero AI hallucinations.
 *
 * Statutory Frameworks Enforced:
 * 1. Limitation Act, 1963 (Articles 55 & 113, Section 18/19 Acknowledgment, SC COVID Exclusion)
 * 2. Commercial Courts Act, 2015 (Section 12A Mandatory Pre-Institution Mediation)
 * 3. MSMED Act, 2006 (Sections 15, 16 3x RBI Bank Rate Interest, Section 18 MSEFC Route, Section 19 Pre-deposit)
 * 4. Arbitration and Conciliation Act, 1996 (Section 29B Fast-Track Arbitration)
 * 5. Mediation Act, 2023 (Section 27 Court Decree Enforceability) // [needs legal verification: Mediation Act 2023 ss. 19, 27, 28]
 * // [needs legal verification: Gujarat State Civil Supplies Corp year]
 *
 * Governance: JustNivaran Institutional Rules Engine v3.1 (Updated October 2026)
 */

import { calculateAuthoritativeFee, GST_RATE, FEE_SLABS } from "./feeSchedule.js";

// ============================================================================
// CONFIGURABLE CONSTANTS & STATUTORY BENCHMARKS
// ============================================================================

/**
 * Current RBI Bank Rate (Notified by Reserve Bank of India)
 * Under Section 16 of the MSMED Act, 2006, statutory interest is 3x this rate.
 * Updated to 5.75% per annum effective 07 October 2026.
 */
export const RBI_BANK_RATE = 0.0575; // 5.75% per annum (3x = 17.25% p.a.)

/**
 * Historical and Notified RBI Bank Rate Benchmarks
 */
export const RBI_RATE_HISTORY = [
  {
    effectiveDate: "2026-10-07",
    bankRate: 0.0575,
    statutory3xRate: 0.1725,
    label: "5.75% (RBI MPC Notification Oct 2026 — Statutory 3x = 17.25% p.a.)"
  },
  {
    effectiveDate: "2023-02-08",
    bankRate: 0.0675,
    statutory3xRate: 0.2025,
    label: "6.75% (Historical benchmark 2023–2026 — Statutory 3x = 20.25% p.a.)"
  }
];

/**
 * Supreme Court COVID-19 Limitation Exclusion Period
 * Order in Suo Motu Writ Petition (C) No. 3 of 2020 (In Re: Cognizance for Extension of Limitation)
 * Period from 15.03.2020 to 28.02.2022 stands excluded from computation of limitation.
 */
export const COVID_EXCLUSION_START = "2020-03-15";
export const COVID_EXCLUSION_END = "2022-02-28";
export const COVID_POST_WINDOW_EXPIRY_FLOOR = "2022-05-29"; // 90 days from 01-03-2022

/**
 * Commercial Courts Act 2015 Specified Value Minimum Threshold
 */
export const COMMERCIAL_COURT_SPECIFIED_VALUE_MIN = 300000; // ₹ 3,00,000

/**
 * Statutory limitation period for contract and money debt claims (Years)
 */
export const STATUTORY_LIMITATION_YEARS = 3;

/**
 * MSMED Act Section 15 statutory ceiling for payment (Days)
 */
export const MSMED_MAX_CREDIT_DAYS = 45;

// ============================================================================
// MODULE 1: LIMITATION CALCULATION ENGINE
// ============================================================================

/**
 * Calculate statutory limitation status under Limitation Act, 1963.
 * Handles Section 18 written acknowledgment of liability and Supreme Court COVID exclusion.
 *
 * @param {Object} params
 * @param {string|Date} params.breachDate - Date when cause of action / breach accrued
 * @param {string|Date} [params.acknowledgmentDate] - Date of latest part-payment or written acknowledgment (Sec 18/19)
 * @param {boolean} [params.signedWrittenAcknowledgment] - Whether document constitutes a signed acknowledgment of liability to pay
 * @param {string} [params.acknowledgmentDocumentType] - Nature of document (e.g. Joint Site Measurement Sheet, Balance Confirmation)
 * @param {string|Date} [params.asOfDate] - Reference date for calculation
 * @returns {Object} Limitation assessment
 */
export function calculateLimitation({
  breachDate,
  acknowledgmentDate = null,
  signedWrittenAcknowledgment = false,
  acknowledgmentDocumentType = "",
  asOfDate = new Date()
}) {
  if (!breachDate) {
    return {
      status: "Insufficient Information",
      label: "Breach Date Not Provided",
      daysRemaining: null,
      expiryDate: null,
      explanation: "A precise date of breach is required to compute statutory limitation under Articles 55 & 113 of the Limitation Act, 1963."
    };
  }

  const start = new Date(breachDate);
  if (isNaN(start.getTime())) {
    return {
      status: "Insufficient Information",
      label: "Invalid Breach Date",
      daysRemaining: null,
      expiryDate: null,
      explanation: "The date of breach provided could not be parsed."
    };
  }

  const ack = acknowledgmentDate ? new Date(acknowledgmentDate) : null;
  const isAckValid = Boolean(ack && !isNaN(ack.getTime()) && ack > start);

  // Section 18 Statutory Construction:
  // If an acknowledgment exists, mark as "possible reset, subject to review" (never mark "verified")
  const effectiveStart = isAckValid ? ack : start;
  const hasSection18Acknowledgment = isAckValid;

  let acknowledgmentReviewNote = null;
  if (hasSection18Acknowledgment) {
    if (signedWrittenAcknowledgment) {
      acknowledgmentReviewNote = `Possible reset under Section 18 Limitation Act from ${ack.toISOString().split("T")[0]}, subject to formal adjudicatory review: requires establishing that the signed document (${acknowledgmentDocumentType || "written document"}) constitutes an unequivocal, conscious acknowledgment of existing liability to pay the claimed debt.`;
    } else {
      acknowledgmentReviewNote = `Document dated ${ack.toISOString().split("T")[0]} (${acknowledgmentDocumentType || "record"}) recorded, but lack of signed written acknowledgment of liability to pay means limitation reset is highly doubtful and subject to strict court scrutiny.`;
    }
  }

  // Calculate 3 calendar years forward from effectiveStart
  const standardExpiry = new Date(effectiveStart.getTime());
  standardExpiry.setFullYear(standardExpiry.getFullYear() + STATUTORY_LIMITATION_YEARS);

  // Supreme Court COVID-19 Exclusion Calculation (15 Mar 2020 - 28 Feb 2022)
  const covidStart = new Date(`${COVID_EXCLUSION_START}T00:00:00Z`);
  const covidEnd = new Date(`${COVID_EXCLUSION_END}T23:59:59Z`);

  let covidExcludedDays = 0;
  const overlapStart = new Date(Math.max(effectiveStart.getTime(), covidStart.getTime()));
  const overlapEnd = new Date(Math.min(standardExpiry.getTime(), covidEnd.getTime()));

  if (overlapEnd > overlapStart) {
    covidExcludedDays = Math.ceil((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Extend final expiry by excluded days
  const finalExpiry = new Date(standardExpiry.getTime() + covidExcludedDays * 24 * 60 * 60 * 1000);

  // SC Order: If limitation expired during the COVID window, minimum extension was 90 days from 01-03-2022
  const covidFloor = new Date(`${COVID_POST_WINDOW_EXPIRY_FLOOR}T23:59:59Z`);
  if (finalExpiry < covidFloor && standardExpiry >= covidStart) {
    finalExpiry.setTime(covidFloor.getTime());
  }

  const today = new Date(asOfDate);
  const msDiff = finalExpiry.getTime() - today.getTime();
  const daysRemaining = Math.ceil(msDiff / (1000 * 60 * 60 * 24));

  let status = "In time";
  let label = "Within Limitation Period";
  if (daysRemaining < 0) {
    status = "Likely barred";
    label = "Time-Barred under Limitation Act, 1963";
  } else if (daysRemaining <= 90) {
    status = "Close to expiry";
    label = "Critical: Close to Expiry (< 90 Days)";
  }

  return {
    status,
    label,
    daysRemaining: daysRemaining >= 0 ? daysRemaining : 0,
    daysElapsedSinceExpiry: daysRemaining < 0 ? Math.abs(daysRemaining) : 0,
    breachDate: start.toISOString().split("T")[0],
    acknowledgmentDate: isAckValid ? ack.toISOString().split("T")[0] : null,
    effectiveStartDate: effectiveStart.toISOString().split("T")[0],
    expiryDate: finalExpiry.toISOString().split("T")[0],
    covidExcludedDays,
    hasSection18Acknowledgment,
    signedWrittenAcknowledgment: Boolean(signedWrittenAcknowledgment),
    acknowledgmentReviewNote,
    statutoryBasis: "Articles 55 & 113, Limitation Act, 1963 (3-year statutory bar for debt/breach claims)"
  };
}

// ============================================================================
// MODULE 2: SECTION 12A COMMERCIAL COURTS ACT 2015 ENGINE
// ============================================================================

/**
 * Determine applicability of Section 12A pre-institution mediation.
 * Institutional Statutory Clarifications Enforced:
 * 1. If arbitration clause exists / arbitration chosen: Section 12A is NOT required.
 * 2. If court litigation route: Section 12A is a mandatory prerequisite for filing in court.
 * 3. Does NOT claim JustNivaran satisfies 12A; directs claimant to verify authorized DLSA/SLSA route.
 *
 * @param {Object} params
 * @param {number} params.claimQuantum - Dispute amount in INR
 * @param {boolean} [params.hasArbitrationClause] - Contract contains arbitration clause
 * @param {boolean} [params.arbitrationChosen] - Claimant chooses arbitration
 * @param {boolean} [params.urgentInterimRelief] - Urgent interim relief (Order 39) needed
 * @param {boolean} [params.isCommercial] - Commercial dispute under Section 2(1)(c)
 * @returns {Object} Section 12A determination
 */
export function checkSection12A({
  claimQuantum = 0,
  hasArbitrationClause = false,
  arbitrationChosen = false,
  urgentInterimRelief = false,
  isCommercial = true
}) {
  const quantum = Number(claimQuantum) || 0;

  if (hasArbitrationClause || arbitrationChosen) {
    return {
      applicable: false,
      mandatory: false,
      status: "Not Required (Arbitration Governs)",
      rationale: "An arbitration agreement exists between the parties. Section 12A pre-institution mediation applies exclusively to commercial suits instituted before Commercial Courts; arbitral proceedings under the Arbitration & Conciliation Act, 1996 (Sections 8, 9, 11) do not require Section 12A pre-institution mediation.",
      statutoryAdvisory: "Dispute proceeds under the contractual arbitration mechanism. Court pre-institution mediation is inapplicable."
    };
  }

  if (!isCommercial) {
    return {
      applicable: false,
      mandatory: false,
      status: "Not Applicable (Non-Commercial Dispute)",
      rationale: "Section 12A applies strictly to commercial disputes defined under Section 2(1)(c) of the Commercial Courts Act, 2015.",
      statutoryAdvisory: null
    };
  }

  if (quantum < COMMERCIAL_COURT_SPECIFIED_VALUE_MIN) {
    return {
      applicable: false,
      mandatory: false,
      status: "Below Specified Value Threshold (< ₹3,00,000)",
      rationale: `The claim quantum (₹${quantum.toLocaleString("en-IN")}) is below the ₹3,00,000 specified value threshold required for Commercial Court jurisdiction under Section 2(1)(i) of the Commercial Courts Act, 2015. Regular civil court procedures apply.`,
      statutoryAdvisory: null
    };
  }

  if (urgentInterimRelief) {
    return {
      applicable: true,
      mandatory: false,
      status: "Dispensed With (Urgent Interim Relief Claimed)",
      rationale: "Urgent interim relief is sought. Under the proviso to Section 12A(1) of the Commercial Courts Act, 2015, pre-institution mediation is dispensed with when urgent interim orders are contemplated.",
      statutoryAdvisory: "Claimant may file suit directly before the Commercial Court accompanied by an urgent interim application (under Order 39 CPC or Section 12A proviso). However, the court will evaluate whether urgency is genuine before entertaining the suit without mediation."
    };
  }

  return {
    applicable: true,
    mandatory: true,
    status: "Mandatory Pre-Institution Mediation Prerequisite",
    rationale: "Section 12A(1) of the Commercial Courts Act, 2015 is a mandatory jurisdictional prerequisite before filing a commercial suit in court. Per the Supreme Court ruling in Patil Automation Pvt. Ltd. v. Rakheja Engineers Pvt. Ltd. (2022), any commercial suit instituted without exhausting pre-institution mediation (absent urgent interim relief) is liable to be rejected under Order VII Rule 11 CPC.",
    statutoryAdvisory: "Statutory Compliance Note: To satisfy the threshold jurisdictional requirement of Section 12A for filing a commercial suit in court, mediation must be exhausted through the designated statutory authority under the Commercial Courts (Pre-Institution Mediation and Settlement) Rules, 2018 (conducted via State or District Legal Services Authorities - SLSA/DLSA). Institutional mediation administered by JustNivaran operates by party consent under the Mediation Act, 2023."
  };
}

// ============================================================================
// MODULE 3: MSMED ACT 2006 (SECTIONS 15, 16, 18 & 19 ENGINE)
// ============================================================================

/**
 * Determine MSMED Act statutory protections, interest, and MSEFC eligibility.
 * Enforces:
 * 1. Sections 15 & 16 apply to MICRO and SMALL suppliers only (not Medium).
 * 2. Supplier must hold valid Udyam registration at contract inception (Silpi Industries doctrine).
 * 3. Interest computed from the Section 15 "appointed day" (acceptance date + agreed credit days, capped at 45 days).
 * 4. 3x RBI Bank Rate (5.75% -> 17.25% p.a. effective Oct 2026) compound interest calculated monthly.
 * 5. Section 18 MSEFC statutory route.
 * 6. Section 19: 75% pre-deposit applies only when buyer applies to set aside an award/decree/order.
 *
 * @param {Object} params
 * @param {'None'|'Micro'|'Small'|'Medium'} params.enterpriseType - Supplier classification
 * @param {boolean} [params.udyamRegisteredAtContract] - Held Udyam registration at contract date
 * @param {number} params.claimQuantum - Principal claim in INR
 * @param {string|Date} [params.acceptanceDate] - Day of acceptance or deemed acceptance
 * @param {string|Date} [params.invoiceDate] - Invoice date
 * @param {string|Date} [params.breachDate] - General breach date
 * @param {number} [params.agreedCreditDays] - Agreed contractual credit days (capped at 45)
 * @param {string|Date} [params.asOfDate] - Calculation date
 * @param {number} [params.rbiBankRate] - RBI Bank Rate constant (defaults to RBI_BANK_RATE: 5.75%)
 * @returns {Object} MSMED statutory evaluation
 */
export function checkMSMEDApplicability({
  enterpriseType = "None",
  udyamRegisteredAtContract = false,
  claimQuantum = 0,
  acceptanceDate = null,
  hasDeliveryProof = true,
  invoiceDate = null,
  breachDate = null,
  agreedCreditDays = 45,
  asOfDate = new Date(),
  rbiBankRate = RBI_BANK_RATE
}) {
  const isMSE = enterpriseType === "Micro" || enterpriseType === "Small";
  const isMedium = enterpriseType === "Medium";
  const principal = Math.max(0, Number(claimQuantum) || 0);

  if (!isMSE) {
    return {
      applicable: false,
      enterpriseType,
      isMSE: false,
      udyamRegisteredAtContract: false,
      section15Applicable: false,
      section16InterestApplicable: false,
      msefcRouteEligible: false,
      statutoryInterestRate: 0,
      statutoryInterestRatePercent: "0%",
      estimatedStatutoryInterest: 0,
      totalClaimWithInterest: principal,
      rationale: isMedium
        ? "Supplier category is 'Medium Enterprise'. Sections 15, 16, 18, and 19 of the MSMED Act, 2006 apply strictly to Micro and Small Enterprises (MSEs). Medium enterprises cannot invoke statutory 3x compound interest or Section 18 MSEFC statutory facilitation."
        : "Claimant is not registered as a Micro or Small Enterprise under MSMED Act, 2006. General commercial contract law applies."
    };
  }

  // Micro or Small enterprise: verify registration status at contract inception
  if (!udyamRegisteredAtContract) {
    return {
      applicable: false,
      enterpriseType,
      isMSE: true,
      udyamRegisteredAtContract: false,
      section15Applicable: false,
      section16InterestApplicable: false,
      msefcRouteEligible: false,
      statutoryInterestRate: 0,
      statutoryInterestRatePercent: "0%",
      estimatedStatutoryInterest: 0,
      totalClaimWithInterest: principal,
      rationale: `Although the supplier is a ${enterpriseType} Enterprise, Udyam registration was NOT held at the date of entering into the contract. Per the Supreme Court precedent in Silpi Industries v. Kerala State Small Industries Development Corp. (2021), statutory benefits under Sections 15, 16, 18, and 19 of the MSMED Act 2006 cannot be claimed for contracts/supplies predating registration.`
    };
  }

  // Qualified MSE with Udyam registration at contract inception
  const statutoryInterestRate = Math.round(3 * rbiBankRate * 10000) / 10000; // e.g. 3 * 0.0575 = 0.1725 (17.25% p.a.)

  // Section 15 Appointed Day Calculation:
  // Acceptance Date + agreed credit days (capped at 45 days)
  const baseDateObj = acceptanceDate
    ? new Date(acceptanceDate)
    : invoiceDate
      ? new Date(invoiceDate)
      : breachDate
        ? new Date(breachDate)
        : null;

  const creditDaysAllowed = Math.min(Math.max(0, Number(agreedCreditDays) || 45), MSMED_MAX_CREDIT_DAYS);

  let appointedDayObj = null;
  let daysOverdueFromAppointedDay = 0;
  let monthsOverdue = 0;
  let estimatedStatutoryInterest = 0;

  if (baseDateObj && !isNaN(baseDateObj.getTime())) {
    // If acceptanceDate or invoiceDate provided, add credit days
    if (acceptanceDate || invoiceDate) {
      appointedDayObj = new Date(baseDateObj.getTime() + creditDaysAllowed * 24 * 60 * 60 * 1000);
    } else {
      // If only breachDate provided, breach occurs on or after appointed day
      appointedDayObj = new Date(baseDateObj.getTime());
    }

    const today = new Date(asOfDate);
    const diffMs = today.getTime() - appointedDayObj.getTime();
    daysOverdueFromAppointedDay = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    monthsOverdue = daysOverdueFromAppointedDay / 30.4375;

    // Monthly compounding interest formula: A = P * (1 + r/12)^n - P
    if (monthsOverdue > 0 && principal > 0) {
      const monthlyRate = statutoryInterestRate / 12;
      const compoundFactor = Math.pow(1 + monthlyRate, monthsOverdue);
      estimatedStatutoryInterest = Math.round(principal * (compoundFactor - 1));
    }
  }

  const appointedDayStr = appointedDayObj ? appointedDayObj.toISOString().split("T")[0] : "Not provided";
  const baseDateStr = baseDateObj ? baseDateObj.toISOString().split("T")[0] : "Not provided";

  let deemedAcceptanceNote = null;
  if (!acceptanceDate || !hasDeliveryProof) {
    deemedAcceptanceNote = "Evidentiary Note on Appointed Day: In the absence of signed documentary proof of formal acceptance, the Section 2(b) deemed-acceptance rule (15-day objection period following delivery of goods / rendering of services) governs, which may adjust the statutory appointed day and interest commencement date if contested by buyer.";
  }

  return {
    applicable: true,
    enterpriseType,
    isMSE: true,
    udyamRegisteredAtContract: true,
    section15Applicable: true,
    section16InterestApplicable: true,
    msefcRouteEligible: true,
    statutoryCreditDaysCapped: creditDaysAllowed,
    baseDateUsed: baseDateStr,
    appointedDay: appointedDayStr,
    interestStartDate: appointedDayStr,
    deemedAcceptanceNote,
    interestStartExplanation: `Statutory interest runs from the Section 15 appointed day (${appointedDayStr}), derived from acceptance/invoice date (${baseDateStr}) + ${creditDaysAllowed} agreed credit days (capped at 45 days under Section 15 proviso). ${deemedAcceptanceNote ? deemedAcceptanceNote : ""}`,
    rbiBankRate,
    rbiBankRatePercent: `${(rbiBankRate * 100).toFixed(2)}%`,
    statutoryInterestRate,
    statutoryInterestRatePercent: `${(statutoryInterestRate * 100).toFixed(2)}%`,
    interestRateLabel: `Indicative at current Bank Rate (${(statutoryInterestRate * 100).toFixed(2)}% p.a., 3x RBI Bank Rate of ${(rbiBankRate * 100).toFixed(2)}% effective 07 Oct 2026)`,
    daysOverdueFromAppointedDay,
    monthsOverdue: Number(monthsOverdue.toFixed(1)),
    estimatedStatutoryInterest,
    totalClaimWithInterest: principal + estimatedStatutoryInterest,
    // Section 19 accurate statutory phrasing
    section19PreDepositRule: "Section 19 MSMED Act: Mandatory 75% pre-deposit applies only if the buyer files an application before a court to set aside an award, decree, or order made by the Council or its designated ADR centre.",
    rationale: `Qualifies under MSMED Act, 2006 as a registered ${enterpriseType} Enterprise. Section 15 caps credit at 45 days. Section 16 mandates penal compound interest at 3x RBI Bank Rate (${(statutoryInterestRate * 100).toFixed(2)}% p.a.) compounded monthly from the appointed day (${appointedDayStr}). Section 18 gives statutory right to initiate conciliation & arbitration before MSEFC, overriding general arbitration clauses (Gujarat State Civil Supplies Corp v. Mahakali Foods, 2023 SC). Section 19 mandates that a court shall not entertain an application by the buyer to set aside any award or decree without a 75% pre-deposit.`
  };
}

// ============================================================================
// MODULE 4: PROCESS & FEE COMPARISON MATRIX
// ============================================================================

/**
 * Compute side-by-side fee and timeline comparison across ADR processes.
 * Verified to strictly mirror the published Fee Schedule page (/fee-schedule).
 *
 * @param {number} claimQuantum - Dispute quantum in INR
 * @returns {Array<Object>} Process comparison array
 */
export function calculateProcessComparison(claimQuantum) {
  const quantum = Math.max(0, Number(claimQuantum) || 0);
  const negFee = calculateAuthoritativeFee(quantum, "negotiation");
  const medFee = calculateAuthoritativeFee(quantum, "mediation");
  const arbFee = calculateAuthoritativeFee(quantum, "arbitration");

  return [
    {
      processId: "negotiation",
      name: "Assisted Digital Negotiation",
      tagline: "Direct consensual settlement via institutional platform",
      timeline: "15 – 30 Days",
      statutoryFramework: "Contract Law / Consensual Terms",
      consentRequirement: "Mutual voluntary participation",
      slabLabel: negFee.slabLabel,
      baseFee: negFee.baseFee,
      registryFee: negFee.registryFee,
      neutralFee: negFee.neutralHonorarium,
      gstAmount: negFee.gstAmount,
      totalWithGst: negFee.totalWithGst,
      enforceability: "Enforceable as a binding private settlement agreement.",
      suitability: "Ideal for ongoing supplier relationships and uncontested invoice balances."
    },
    {
      processId: "mediation",
      name: "Institutional Commercial Mediation",
      tagline: "Neutral-led structured dialogue with decree-grade settlement",
      timeline: "30 – 60 Days",
      statutoryFramework: "Mediation Act, 2023",
      consentRequirement: "Mutual consent under Mediation Act, 2023",
      slabLabel: medFee.slabLabel,
      baseFee: medFee.baseFee,
      registryFee: medFee.registryFee,
      neutralFee: medFee.neutralHonorarium,
      gstAmount: medFee.gstAmount,
      totalWithGst: medFee.totalWithGst,
      enforceability: "Mediated Settlement Agreement (MSA) is enforceable as a Court Decree under Section 27 of Mediation Act, 2023.",
      suitability: "Recommended for commercial preservation, multi-issue contract claims, and MSME negotiations."
    },
    {
      processId: "arbitration",
      name: "Fast-Track Institutional Arbitration",
      tagline: "Binding adjudication within 6-month statutory cap",
      timeline: "Up to 6 Months (Section 29B cap)",
      statutoryFramework: "Arbitration & Conciliation Act, 1996 (Section 29B)",
      consentRequirement: "Available if both parties consent in writing", // Statutory requirement under Section 29B
      slabLabel: arbFee.slabLabel,
      baseFee: arbFee.baseFee,
      registryFee: arbFee.registryFee,
      neutralFee: arbFee.neutralHonorarium,
      gstAmount: arbFee.gstAmount,
      totalWithGst: arbFee.totalWithGst,
      enforceability: "Arbitral Award is executable directly as a Civil Court Decree under Section 36 of ACA 1996.",
      suitability: "Required where claims are contested, debt is denied, or a binding enforceable award is required."
    }
  ];
}

// ============================================================================
// MODULE 5: FORUM RECOMMENDATION ENGINE
// ============================================================================

/**
 * Determine recommended institutional forum based on documented rules.
 *
 * @param {Object} params
 * @returns {Object} Forum recommendation details
 */
export function determineRecommendedForum({
  quantum,
  hasArbitrationClause,
  isMSE,
  udyamRegisteredAtContract,
  urgentInterimRelief,
  limitationStatus,
  preserveRelationship = true
}) {
  if (limitationStatus === "Likely barred") {
    return {
      recommendedForum: "Pre-Litigation Institutional Mediation",
      statutoryBasis: "Mediation Act, 2023",
      rationale: "Because the claim appears barred by limitation under the Limitation Act 1963, formal court litigation or arbitration faces immediate threshold dismissal under Order VII Rule 11 CPC or Section 16 ACA. Consensual Institutional Mediation offers the only realistic avenue to negotiate a commercial compromise without limitation dismissal.",
      alternativeForum: "Direct Assisted Negotiation"
    };
  }

  // MSEFC Statutory Route (MSMED Section 18)
  if (isMSE && udyamRegisteredAtContract) {
    return {
      recommendedForum: "Statutory MSEFC Facilitation / Institutional Mediation",
      statutoryBasis: "Section 18, MSMED Act, 2006 & Mediation Act, 2023",
      rationale: "Claimant is a registered Micro/Small Enterprise with valid Udyam registration at contract inception. Section 18 of the MSMED Act provides statutory conciliation before MSEFC (or institutional referral) with statutory 3x RBI compound interest. Under Section 19, a mandatory 75% pre-deposit applies only if the buyer files an application before a court to set aside an award/order, overriding general arbitration clauses (Gujarat State Civil Supplies Corp v. Mahakali Foods, 2023 SC).",
      alternativeForum: "Fast-Track Institutional Arbitration (available if both parties consent in writing under Section 29B)"
    };
  }

  // Arbitration Clause present
  if (hasArbitrationClause) {
    if (preserveRelationship || quantum <= 2500000) {
      return {
        recommendedForum: "Institutional Commercial Mediation (Pre-Arbitration)",
        statutoryBasis: "Mediation Act, 2023 & JustNivaran Rules",
        rationale: "An arbitration clause exists. Initiating institutional mediation first affords a rapid 30-day resolution window preserving commercial relations. If unresolved, the dispute seamlessly escalates to Fast-Track Arbitration under Section 29B (available if both parties consent in writing).",
        alternativeForum: "Fast-Track Arbitration (Section 29B ACA 1996, upon mutual written consent)"
      };
    }

    return {
      recommendedForum: "Fast-Track Institutional Arbitration",
      statutoryBasis: "Arbitration & Conciliation Act, 1996 (Section 29B)",
      rationale: "Valid institutional arbitration agreement exists. Fast-track procedure under Section 29B provides a sole arbitrator and a binding decree-grade award within 6 months on written pleadings (available if both parties consent in writing).",
      alternativeForum: "Institutional Commercial Mediation (Mediation Act, 2023)"
    };
  }

  // No Arbitration Clause
  if (urgentInterimRelief) {
    return {
      recommendedForum: "Commercial Court Suit (Urgent Interim Injunction) & Emergency Mediation",
      statutoryBasis: "Commercial Courts Act, 2015 (Section 12A Proviso)",
      rationale: "Urgent interim protection is required. Pre-institution mediation is dispensed with under Section 12A proviso, allowing urgent application before the Commercial Court followed by reference to mediation.",
      alternativeForum: "Expedited Institutional Mediation"
    };
  }

  return {
    recommendedForum: "Mandatory Pre-Institution Mediation (Court Prerequisite)",
    statutoryBasis: "Section 12A, Commercial Courts Act, 2015 & Mediation Act, 2023",
    rationale: "No arbitration clause exists and no urgent interim relief is claimed. Exhaustion of Section 12A pre-institution mediation is a mandatory jurisdictional prerequisite before filing a commercial suit in court (Supreme Court in Patil Automation, 2022). Note: To satisfy Section 12A for court filing, claimant must exhaust mediation through the designated Legal Services Authority under the 2018 Rules.",
    alternativeForum: "Direct Assisted Negotiation"
  };
}

// ============================================================================
// MODULE 6: STRENGTH EVALUATION ENGINE (SEPARATING CLAIMANT GAPS VS DEFENCE)
// ============================================================================

/**
 * Compute institutional strength ratings for claimant and defence.
 * Enforces User Request 8: Separates claimant's own omissions/weaknesses into
 * claimantGaps / evidenceGaps rather than misclassifying them as "Defence Strength".
 * Defence Strength strictly tracks active substantive defenses respondent can assert.
 *
 * @param {Object} params
 * @returns {Object} Strength evaluation
 */
export function calculateStrengthRatings({
  hasWrittenContract = true,
  hasNoticeSent = false,
  limitationStatus = "In time",
  evidenceItems = [],
  enterpriseType = "None",
  udyamRegisteredAtContract = false,
  substantiveDefenses = []
}) {
  let claimantScore = 0;
  const claimantReasons = [];
  const defenceReasons = [];
  const claimantGaps = [];
  const evidenceGaps = [];

  // Contractual Foundation
  if (hasWrittenContract) {
    claimantScore += 2;
    claimantReasons.push("Documentary foundation established with executed written agreement or purchase order.");
  } else {
    claimantReasons.push("Absence of written agreement increases burden of proving oral contract and consensus ad idem.");
    claimantGaps.push("Lack of formal signed written contract or master agreement; privity must be established through collateral correspondence.");
    evidenceGaps.push("Written contract / formal purchase order signed by respondent.");
  }

  // Statutory Limitation
  if (limitationStatus === "Likely barred") {
    claimantScore -= 5;
    claimantReasons.push("Claim appears time-barred under the Limitation Act 1963; high risk of threshold rejection under Order VII Rule 11 CPC or Section 16 ACA.");
    defenceReasons.push("Preliminary objection on statutory limitation: 3-year period expired under Limitation Act 1963.");
  } else if (limitationStatus === "Close to expiry") {
    claimantReasons.push("Claim is within limitation but close to expiry (<90 days remaining); immediate formal invocation required.");
    claimantGaps.push("Limitation window nearing expiry (<90 days); procedural inaction risks crystallizing a statutory time-bar.");
  } else {
    claimantScore += 2;
    claimantReasons.push("Claim is comfortably within the 3-year statutory limitation period.");
  }

  // Evidence Checklist & Compliance
  const ev = Array.isArray(evidenceItems) ? evidenceItems : [];
  const hasInvoices = ev.includes("invoices") || ev.includes("commercial_invoices");
  const hasDelivery = ev.includes("delivery_proof") || ev.includes("delivery_challan") || ev.includes("completion_certificate");
  const hasComms = ev.includes("emails_whatsapp") || ev.includes("written_admissions");
  const hasPartPayment = ev.includes("part_payment_proof") || ev.includes("bank_statement");

  if (hasInvoices) {
    claimantScore += 1;
    claimantReasons.push("Tax/commercial invoices on record establishing quantum and billing.");
  } else {
    claimantGaps.push("Absence of commercial tax invoices matching the exact claimed quantum.");
    evidenceGaps.push("Signed commercial tax invoices matching claim quantum.");
  }

  if (hasDelivery) {
    claimantScore += 2;
    claimantReasons.push("Proof of delivery / completion on record (e.g. stamped delivery challan or milestone signoff).");
  } else {
    // Institutional precision: Missing delivery proof is a claimant omission/gap
    claimantGaps.push("Absence of physical stamped delivery challan or signed UAT receipt allows respondent to dispute actual receipt of goods/services.");
    evidenceGaps.push("Stamped delivery challan / physical work completion certificate signed by respondent.");
  }

  if (hasComms) {
    claimantScore += 1;
    claimantReasons.push("Written communications / admissions of liability on record.");
  }

  if (hasPartPayment) {
    claimantScore += 2;
    claimantReasons.push("Part-payment / bank credit on record establishing acknowledgment of liability under Section 19 Limitation Act.");
  }


  // Demand Notice (User Request 8: Lack of notice is a claimant gap, not defence strength)
  if (hasNoticeSent) {
    claimantScore += 1;
    claimantReasons.push("Formal legal demand notice issued prior to action.");
  } else {
    claimantGaps.push("No prior formal statutory demand notice or Section 21 arbitration invocation served on respondent.");
    evidenceGaps.push("Formal legal demand notice / Section 21 notice of arbitration.");
  }

  // MSME Statutory Advantage
  if ((enterpriseType === "Micro" || enterpriseType === "Small") && udyamRegisteredAtContract) {
    claimantScore += 2;
    claimantReasons.push("Statutory protection under MSMED Act, 2006 (Section 15 45-day rule & Section 16 3x RBI interest).");
  }

  // Substantive Defenses (Active positions respondent asserts)
  if (Array.isArray(substantiveDefenses) && substantiveDefenses.length > 0) {
    substantiveDefenses.forEach((d) => defenceReasons.push(d));
  } else {
    defenceReasons.push("Respondent expected to dispute performance timelines and seek bilateral negotiation concessions.");
  }

  // Pure Qualitative Bands (NO percentage scores)
  let claimantStrength = "Moderate";
  // If delivery/acceptance proof is absent or there are multiple major procedural gaps, cap at Moderate
  const hasMultipleGaps = claimantGaps.length >= 2 || !hasDelivery;
  if (claimantScore >= 6 && limitationStatus !== "Likely barred" && !hasMultipleGaps) {
    claimantStrength = "Strong";
  } else if (claimantScore <= 2 || limitationStatus === "Likely barred") {
    claimantStrength = "Weak";
  }

  let defenceStrength = "Moderate";
  if (claimantStrength === "Strong" && defenceReasons.length <= 1 && !defenceReasons.some((r) => r.includes("time-barred"))) {
    defenceStrength = "Weak";
  } else if (limitationStatus === "Likely barred" || defenceReasons.some((r) => r.includes("liquidated damages") || r.includes("warranty set-off"))) {
    defenceStrength = "Moderate";
  }

  return {
    claimantStrength,
    claimantReasons,
    defenceStrength,
    defenceReasons,
    claimantGaps,
    evidenceGaps
  };
}

// ============================================================================
// MODULE 7: COMPLETE DETERMINISTIC ASSESSMENT DOSSIER
// ============================================================================

/**
 * Generate full authoritative assessment dossier purely from deterministic code.
 *
 * @param {Object} intakeData - Full structured user dispute input
 * @returns {Object} Structured institutional assessment
 */
export function generateDeterministicAssessment(intakeData = {}) {
  const quantum = Math.max(0, Number(intakeData.claimValue) || 0);
  const enterpriseType = intakeData.enterpriseType || "None";
  const udyamRegisteredAtContract = Boolean(intakeData.udyamRegisteredAtContract);
  const hasArbitrationClause = Boolean(
    String(intakeData.arbitrationClauseStatus || "").toLowerCase().includes("yes") ||
    intakeData.hasArbitrationClause === true
  );
  const arbitrationChosen = Boolean(intakeData.arbitrationChosen);
  const urgentInterimRelief = Boolean(intakeData.urgentInterimRelief);
  const hasWrittenContract = Boolean(
    intakeData.hasWrittenContract !== undefined ? intakeData.hasWrittenContract : true
  );
  const hasNoticeSent = Boolean(intakeData.hasNoticeSent);
  const breachDate = intakeData.breachDate || null;
  const acknowledgmentDate = intakeData.acknowledgmentDate || null;
  const signedWrittenAcknowledgment = Boolean(intakeData.signedWrittenAcknowledgment);
  const acknowledgmentDocumentType = intakeData.acknowledgmentDocumentType || "";
  const acceptanceDate = intakeData.acceptanceDate || null;
  const invoiceDate = intakeData.invoiceDate || null;
  const agreedCreditDays = intakeData.agreedCreditDays !== undefined ? intakeData.agreedCreditDays : 45;
  const evidenceItems = Array.isArray(intakeData.evidenceList) ? intakeData.evidenceList : [];
  const asOfDate = intakeData.asOfDate || new Date();
  const substantiveDefenses = Array.isArray(intakeData.substantiveDefenses) ? intakeData.substantiveDefenses : [];

  const hasDelivery = evidenceItems.includes("delivery_proof") || evidenceItems.includes("delivery_challan") || evidenceItems.includes("completion_certificate");

  // 1. Run Limitation Engine
  const limitation = calculateLimitation({
    breachDate,
    acknowledgmentDate,
    signedWrittenAcknowledgment,
    acknowledgmentDocumentType,
    asOfDate
  });

  // 2. Run Section 12A Commercial Courts Act Engine
  const section12A = checkSection12A({
    claimQuantum: quantum,
    hasArbitrationClause,
    arbitrationChosen,
    urgentInterimRelief,
    isCommercial: true
  });

  // 3. Run MSMED Act Engine (Interest from Section 15 Appointed Day)
  const msmed = checkMSMEDApplicability({
    enterpriseType,
    udyamRegisteredAtContract,
    claimQuantum: quantum,
    acceptanceDate,
    hasDeliveryProof: hasDelivery,
    invoiceDate,
    breachDate,
    agreedCreditDays,
    asOfDate,
    rbiBankRate: RBI_BANK_RATE
  });

  // 4. Run ADR Process Fee & Timeline Matrix
  const processComparison = calculateProcessComparison(quantum);

  // 5. Run Recommended Forum Assignment
  const forumRecommendation = determineRecommendedForum({
    quantum,
    hasArbitrationClause,
    isMSE: msmed.isMSE,
    udyamRegisteredAtContract: msmed.udyamRegisteredAtContract,
    urgentInterimRelief,
    limitationStatus: limitation.status,
    preserveRelationship: intakeData.preserveRelationship !== false
  });

  // 6. Run Strength Ratings Engine
  const strength = calculateStrengthRatings({
    hasWrittenContract,
    hasNoticeSent,
    limitationStatus: limitation.status,
    evidenceItems,
    enterpriseType,
    udyamRegisteredAtContract,
    substantiveDefenses
  });

  // Unique reference identifier
  const requestId = `JN-RULES-${Math.floor(100000 + Math.random() * 900000)}`;

  // Formulate 3 Realistic Scenarios (Qualitative - No rupee estimates from AI)
  const scenarios = [
    {
      scenario: "Primary Invoiced Claim Sustained",
      likelihood: strength.claimantStrength === "Strong" ? "High" : "Medium",
      explanation: "Documented invoices and delivery acknowledgments are admitted without substantial set-off, yielding primary principal recovery."
    },
    {
      scenario: "Negotiated / Mediated Settlement",
      likelihood: "High",
      explanation: "Commercial compromise reached during structured mediation, adjusting for alleged performance variations or payment timeline concessions."
    },
    {
      scenario: "Contested Defense / Set-off Deduction",
      likelihood: strength.defenceStrength === "Strong" ? "High" : "Low",
      explanation: "Respondent raises substantive counter-claims or procedural challenges, requiring formal adjudication."
    }
  ];

  // Qualitative Settlement Outlook (NO percentages, NO rupee settlement figures)
  let settlementOutlookRating = "Substantial partial recovery likely";
  let settlementOutlookExplanation = "Substantive documentary record supports principal claim, subject to commercial negotiation adjustments.";

  if (strength.claimantStrength === "Strong" && strength.defenceStrength === "Weak" && limitation.status === "In time") {
    settlementOutlookRating = "Full recovery likely";
    settlementOutlookExplanation = "Documented claim with verified contractual and delivery records; low procedural risk of deduction.";
  } else if (strength.claimantStrength === "Moderate") {
    settlementOutlookRating = "Partial recovery likely";
    settlementOutlookExplanation = "Procedural gaps or absence of signed delivery acknowledgement warrant structured settlement or mediation.";
  } else if (limitation.status === "Likely barred" || strength.claimantStrength === "Weak") {
    settlementOutlookRating = "Uncertain";
    settlementOutlookExplanation = "Statutory limitation bar or substantial evidentiary deficiencies present significant threshold litigation hurdles.";
  }

  const settlementOutlook = {
    rating: settlementOutlookRating,
    explanation: settlementOutlookExplanation
  };

  return {
    requestId,
    generatedAt: new Date().toISOString(),
    engineType: "Rules-engine assessment",
    modelUsed: "JustNivaran Institutional Rules Engine (Deterministic v3.1)",
    isLiveAI: false,

    // Case Details
    category: intakeData.category || "Commercial Contract & Supply Default",
    claimQuantum: quantum,
    claimQuantumFormatted: `₹ ${quantum.toLocaleString("en-IN")}`,

    // Statutory Deterministic Modules
    limitation,
    section12A,
    msmed,
    forumRecommendation,
    processComparison,

    // Strength, Gaps & Evidence
    claimStrength: {
      rating: strength.claimantStrength,
      reasons: strength.claimantReasons
    },
    defenceStrength: {
      rating: strength.defenceStrength,
      reasons: strength.defenceReasons
    },
    claimantGaps: strength.claimantGaps,
    evidenceGaps: strength.evidenceGaps,

    // Scenarios & Qualitative Outlook (NO percentages)
    settlementOutlook,
    likelyOutcomeScenarios: scenarios,

    // Key Legal Issues
    keyLegalIssues: [
      `Limitation validity under Limitation Act 1963 (${limitation.status})`,
      section12A.applicable
        ? `Section 12A Commercial Courts Act 2015 pre-institution mediation compliance (${section12A.status})`
        : "Arbitration clause governance under Arbitration & Conciliation Act 1996",
      msmed.applicable
        ? `Statutory 3x RBI interest under Section 16 MSMED Act 2006 (${msmed.interestRateLabel}; Overdue: ₹${msmed.estimatedStatutoryInterest.toLocaleString("en-IN")})`
        : "Contractual damages and interest under Section 73 Indian Contract Act 1872"
    ].filter(Boolean),

    // Recommended Next Steps
    recommendedNextSteps: [
      `Initiate ${forumRecommendation.recommendedForum} under ${forumRecommendation.statutoryBasis}.`,
      "Collate and verify the evidence checklist, addressing the identified evidentiary gaps.",
      hasNoticeSent ? "Proceed with institutional filing." : "Serve formal legal demand notice specifying statutory timelines."
    ],

    // Confidence Rule: Confidence cannot be "High" if any evidence gap exists
    confidence: (strength.evidenceGaps.length === 0 && strength.claimantGaps.length === 0 && limitation.status === "In time" && hasWrittenContract) ? "High" : "Moderate",
    disclaimer: "Institutional rules-engine indicative assessment. Not formal legal advice. Outcomes depend on evidence and the neutral's independent adjudication."
  };
}

// ============================================================================
// MODULE 8: THE 4 BENCHMARK PRESETS (REALISTIC SYNTHETIC CASES)
// ============================================================================

export const BENCHMARK_PRESETS = [
  {
    id: "preset-commercial-supply",
    label: "💰 Unpaid Invoices (₹15L)",
    category: "Commercial Contract & Supply Default",
    claimValue: 1500000,
    enterpriseType: "None",
    udyamRegisteredAtContract: false,
    breachDate: "2025-11-15",
    acceptanceDate: "2025-11-15",
    agreedCreditDays: 30,
    acknowledgmentDate: null,
    signedWrittenAcknowledgment: false,
    acknowledgmentDocumentType: "",
    hasWrittenContract: true,
    hasArbitrationClause: true,
    arbitrationClauseStatus: "Yes - Institutional Arbitration Clause (Specified Institution)",
    hasNoticeSent: true,
    urgentInterimRelief: false,
    substantiveDefenses: [
      "Respondent alleges minor delivery delay and requests commercial payment grace period."
    ],
    evidenceList: [
      "invoices",
      "delivery_proof",
      "purchase_order",
      "contract",
      "emails_whatsapp"
    ],
    factsSummary: "Supplier delivered commercial machinery spares worth ₹15,00,000 against Purchase Order PO-2025-881. Buyer accepted goods with stamped delivery challan. Final invoice due within 30 days remains unpaid past 90 days. Buyer issued email acknowledging cashflow delay.",
    factualChronology: "1. On 10 Oct 2025, Buyer issued Purchase Order PO-2025-881 for industrial spares.\n2. On 15 Nov 2025, goods worth ₹15,00,000 delivered and received under stamped delivery challan.\n3. Invoice raised on 15 Nov 2025 with 30-day payment term (due 15 Dec 2025).\n4. On 10 Jan 2026, formal demand notice issued.\n5. Payment remains fully outstanding.",
    primaryClaims: "1. Outstanding principal sum of INR 15,00,000.\n2. Commercial pre-award and post-award interest under Section 31(7) ACA 1996.\n3. Institutional dispute costs.",
    expectedDefenses: "Buyer alleges minor delivery delay and requests unilateral 90-day extension without statutory interest."
  },
  {
    id: "preset-msme-vendor",
    label: "🏭 MSME Vendor Dues (₹4.5L)",
    category: "MSME Delayed Payments (MSMED Act 2006)",
    claimValue: 450000,
    enterpriseType: "Small",
    udyamRegisteredAtContract: true, // Held Udyam at contract date (Silpi Industries)
    acceptanceDate: "2025-11-28", // Day of acceptance
    agreedCreditDays: 43, // Capped at 45 days max under Section 15
    breachDate: "2026-01-10", // Appointed day: 28 Nov 2025 + 43 days = 10 Jan 2026
    acknowledgmentDate: null,
    signedWrittenAcknowledgment: false,
    acknowledgmentDocumentType: "",
    hasWrittenContract: true,
    hasArbitrationClause: false,
    arbitrationClauseStatus: "No - Standard Purchase Order Only",
    hasNoticeSent: true,
    urgentInterimRelief: false,
    substantiveDefenses: [
      "Respondent claims internal invoice verification backlog and disputes compound interest rate applicability."
    ],
    evidenceList: [
      "invoices",
      "delivery_proof",
      "udyam_certificate",
      "bank_statement",
      "emails_whatsapp"
    ],
    factsSummary: "Small Enterprise with active Udyam registration supplied precision tooling components worth ₹4,50,000. Buyer accepted components without objection on 28 Nov 2025. Agreed credit was 43 days. Appointed day was 10 Jan 2026. Payment overdue attracts Section 16 compound interest at 3x RBI Bank Rate (17.25% p.a.).",
    factualChronology: "1. Supplier holds valid Udyam Registration (Small Enterprise) since 2023.\n2. Purchase Order received and executed on 26 Nov 2025.\n3. Goods accepted with inspection sign-off on 28 Nov 2025.\n4. Section 15 mandatory credit period expired on 10 Jan 2026 (appointed day).\n5. Statutory notice served on 15 Jan 2026 invoking Section 16 MSMED Act.",
    primaryClaims: "1. Principal outstanding of INR 4,50,000.\n2. Statutory penal compound interest at 3x RBI Bank Rate (17.25% p.a.) compounded monthly under Section 16 MSMED Act, 2006 from appointed day.\n3. Facilitation costs.",
    expectedDefenses: "Buyer claims internal invoice verification backlog and disputes statutory MSME interest applicability."
  },
  {
    id: "preset-construction-epc",
    label: "🏗️ Construction & EPC Delay (₹50L)",
    category: "Construction, EPC & Infrastructure Delays",
    claimValue: 5000000,
    enterpriseType: "Medium", // Medium enterprise (Sections 15-16 MSMED do not apply)
    udyamRegisteredAtContract: false,
    breachDate: "2024-06-30",
    acknowledgmentDate: "2025-08-15", // Joint site meeting minutes
    signedWrittenAcknowledgment: true,
    acknowledgmentDocumentType: "Joint Site Measurement Sheet",
    hasWrittenContract: true,
    hasArbitrationClause: true,
    arbitrationClauseStatus: "Yes - Institutional Arbitration Clause (Specified Institution)",
    hasNoticeSent: true,
    urgentInterimRelief: false,
    substantiveDefenses: [
      "Main contractor asserts delay liquidated damages deduction under Section 74 Indian Contract Act.",
      "Contractor disputes whether Joint Measurement Sheet constitutes an unequivocal admission of financial liability to pay."
    ],
    evidenceList: [
      "contract",
      "invoices",
      "completion_certificate",
      "joint_measurement_sheets",
      "emails_whatsapp"
    ],
    factsSummary: "Subcontractor completed structural concrete works for commercial IT park. Main contractor withheld final RA Bill No. 12 of ₹50,00,000 alleging project-wide delay penalties. Joint measurement sheets signed on 15 Aug 2025 acknowledge executed quantities without liquidated damages deduction.",
    factualChronology: "1. Subcontract executed on 12 Jan 2023 with Fast-Track Institutional Arbitration clause.\n2. Milestone works completed on 30 Jun 2024; RA Bill 12 submitted.\n3. Main contractor withheld ₹50,00,000 citing overall project delay.\n4. On 15 Aug 2025, Joint Site Meeting Minutes executed acknowledging completed measurements.\n5. Formal dispute notice invoking Section 21 ACA issued on 20 Jan 2026.",
    primaryClaims: "1. Release of RA Bill 12 principal sum of INR 50,00,000.\n2. Pre-award and post-award interest under Section 31(7) ACA 1996.\n3. Refund of wrongful liquidated damages deductions under Section 74 Indian Contract Act.",
    expectedDefenses: "Main contractor asserts liquidated damages clause for delay and seeks back-to-back set-off from developer claims."
  },
  {
    id: "preset-it-services-sla",
    label: "💻 IT & Software SLA Breach (₹10L)",
    category: "IT Services, Software SLA & Technology Licensing",
    claimValue: 1000000,
    enterpriseType: "Micro",
    udyamRegisteredAtContract: true,
    acceptanceDate: "2025-08-17", // UAT sign-off date
    agreedCreditDays: 15, // Appointed day: 01 Sep 2025
    breachDate: "2025-09-01",
    acknowledgmentDate: null,
    signedWrittenAcknowledgment: false,
    acknowledgmentDocumentType: "",
    hasWrittenContract: true,
    hasArbitrationClause: false, // Court litigation / Section 12A applies
    arbitrationClauseStatus: "No - Courts of New Delhi Exclusive Jurisdiction",
    hasNoticeSent: false, // Formal notice pending
    urgentInterimRelief: false,
    substantiveDefenses: [
      "Respondent client contends code delivery was subject to unresolved Jira cosmetic bug tickets and invokes contractual warranty clause."
    ],
    evidenceList: [
      "contract",
      "invoices",
      "digital_records",
      "emails_whatsapp"
    ],
    factsSummary: "Software development boutique developed custom ERP module and deployed code to client's production environment on 17 Aug 2025 upon staging completion. However, no formal signed UAT completion certificate was executed. Client operationalized the system in daily commercial operations but withheld milestone 3 payment of ₹10,00,000 citing minor cosmetic Jira tickets. Developer relies on deemed acceptance through continued commercial production deployment.",
    factualChronology: "1. Master Services Agreement and SOW executed on 15 Mar 2025.\n2. Development sprint completed and code deployed to production environment on 17 Aug 2025 without formal signed UAT receipt.\n3. Appointed day arrived on 01 Sep 2025 (15 days agreed credit); Milestone 3 invoice submitted.\n4. Client operational on system in live commercial operations but withheld ₹10,00,000 payment citing minor cosmetic Jira tickets.\n5. Informal email reminders exchanged; formal legal notice not yet issued.",
    primaryClaims: "1. Milestone 3 payment of INR 10,00,000.\n2. Section 16 MSMED Act statutory compound interest at 3x RBI Bank Rate (17.25% p.a.).\n3. Restraining unauthorized continued code utilization under Copyright Act 1957.",
    expectedDefenses: "Client contends delivery was subject to unresolved Jira cosmetic bug tickets and invokes warranty clause, contesting whether deployment constituted unconditional acceptance."
  }
];
