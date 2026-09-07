/**
 * JustNivaran Institutional Fee Schedule Engine
 * Authoritative source of truth for all pricing, slabs, and component breakdowns.
 * Governance: Version 2.4 (Effective: 01 September 2026)
 * Published by JustNivaran Private Limited, New Delhi, India.
 */

export const GST_RATE = 0.18; // 18% Statutory GST

export const FEE_SLABS = [
  {
    id: "slab-1",
    minAmount: 0,
    maxAmount: 500000,
    label: "Up to ₹ 5,00,000 (MSME Tier)",
    negotiationFee: 2500,
    mediationFee: 7500,
    fastTrackArbitrationFee: 15000,
    arbitratorType: "Single Arbitrator",
    targetDays: "15 – 30 Days"
  },
  {
    id: "slab-2",
    minAmount: 500001,
    maxAmount: 2500000,
    label: "₹ 5,00,001 – ₹ 25,00,000",
    negotiationFee: 5000,
    mediationFee: 18000,
    fastTrackArbitrationFee: 35000,
    arbitratorType: "Single Arbitrator (Section 29B)",
    targetDays: "30 – 45 Days"
  },
  {
    id: "slab-3",
    minAmount: 2500001,
    maxAmount: 10000000,
    label: "₹ 25,00,001 – ₹ 1,00,00,000",
    negotiationFee: 10000,
    mediationFee: 35000,
    fastTrackArbitrationFee: 65000,
    arbitratorType: "Single Arbitrator (Section 29B)",
    targetDays: "45 – 60 Days"
  },
  {
    id: "slab-4",
    minAmount: 10000001,
    maxAmount: Infinity,
    label: "Above ₹ 1,00,00,000 (Commercial High-Value)",
    negotiationFee: 20000,
    mediationFeeRate: 0.0035, // 0.35% of claim
    fastTrackArbitrationDescription: "As per Fourth Schedule (Arbitration Act)",
    arbitratorType: "Sole Arbitrator / Three-Member Tribunal",
    targetDays: "60 – 90 Days"
  }
];

/**
 * Calculate authoritative institutional fee for a given claim amount and ADR track
 * @param {number} claimAmount - Disputed claim quantum in INR
 * @param {'negotiation' | 'mediation' | 'arbitration'} track - Selected ADR framework
 * @returns {object} Full component breakdown, base fee, GST, and total payable
 */
export function calculateAuthoritativeFee(claimAmount, track = "arbitration") {
  const quantum = Math.max(0, Number(claimAmount) || 0);

  let baseFee = 15000;
  let slab = FEE_SLABS[0];

  if (quantum <= 500000) {
    slab = FEE_SLABS[0];
    baseFee = track === "negotiation" ? slab.negotiationFee : track === "mediation" ? slab.mediationFee : slab.fastTrackArbitrationFee;
  } else if (quantum <= 2500000) {
    slab = FEE_SLABS[1];
    baseFee = track === "negotiation" ? slab.negotiationFee : track === "mediation" ? slab.mediationFee : slab.fastTrackArbitrationFee;
  } else if (quantum <= 10000000) {
    slab = FEE_SLABS[2];
    baseFee = track === "negotiation" ? slab.negotiationFee : track === "mediation" ? slab.mediationFee : slab.fastTrackArbitrationFee;
  } else {
    slab = FEE_SLABS[3];
    if (track === "negotiation") {
      baseFee = slab.negotiationFee;
    } else if (track === "mediation") {
      baseFee = Math.round(quantum * slab.mediationFeeRate);
    } else {
      // Model Fourth Schedule for > 1 Cr: ₹ 65,000 + 0.5% of claim amount above ₹ 1 Cr (capped)
      baseFee = Math.round(65000 + (quantum - 10000000) * 0.005);
    }
  }

  // Component breakdown allocation:
  // (i) Institutional Administration & Digital Registry (35%)
  // (ii) Presiding Neutral Honorarium (65%)
  const registryFee = Math.round(baseFee * 0.35);
  const neutralHonorarium = baseFee - registryFee;
  const gstAmount = Math.round(baseFee * GST_RATE);
  const totalWithGst = baseFee + gstAmount;

  return {
    claimAmount: quantum,
    track,
    slabLabel: slab.label,
    baseFee,
    registryFee,
    neutralHonorarium,
    gstRate: GST_RATE,
    gstAmount,
    totalWithGst,
    arbitratorType: slab.arbitratorType,
    targetDays: slab.targetDays
  };
}
