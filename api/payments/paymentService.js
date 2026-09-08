/**
 * JustNivaran ODR — Unified Payment Gateway Service
 * Integrates Version 2.4 statutory fee schedule with multi-provider payment processing.
 */

import { calculateAuthoritativeFee } from "../../src/lib/feeSchedule.js";
import { createRazorpayOrder, verifyRazorpayPaymentSignature } from "./razorpayAdapter.js";
import { createInstitutionalInvoiceOrder } from "./institutionalAdapter.js";

/**
 * Check if Razorpay live credentials are fully configured in the environment
 */
export function isRazorpayConfigured() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  return Boolean(keyId && keySecret && keyId.length > 5 && keySecret.length > 5);
}

/**
 * Creates a payment order for a dispute filing or procedural fee
 * @param {object} params
 * @param {number} params.claimAmount - Claim value in INR
 * @param {string} params.track - 'arbitration' | 'mediation' | 'negotiation'
 * @param {string} params.docketNumber - Dispute docket (e.g. "JN-2026-ARB-1001")
 * @param {string} params.partyName - Name of the paying party
 * @param {string} params.partyEmail - Email of the paying party
 * @param {string} params.partyPhone - Phone of the paying party
 * @param {string} [params.preferredProvider] - 'razorpay' | 'institutional' | 'auto'
 */
export async function initializePaymentOrder({
  claimAmount,
  track = "arbitration",
  docketNumber,
  partyName = "Claimant",
  partyEmail = "",
  partyPhone = "",
  preferredProvider = "auto"
}) {
  const feeCalc = calculateAuthoritativeFee(claimAmount, track);
  const totalInr = feeCalc.totalWithGst;
  const amountPaise = totalInr * 100;

  const breakdown = {
    claimAmount: feeCalc.claimAmount,
    slabLabel: feeCalc.slabLabel,
    track: feeCalc.track,
    baseFee: feeCalc.baseFee,
    registryShare: feeCalc.registryFee,
    neutralShare: feeCalc.neutralHonorarium,
    gstRate: feeCalc.gstRate,
    gstAmount: feeCalc.gstAmount,
    totalPayable: feeCalc.totalWithGst,
    arbitratorType: feeCalc.arbitratorType,
    targetDays: feeCalc.targetDays
  };

  const razorpayActive = isRazorpayConfigured();
  const useRazorpay = preferredProvider === "razorpay" || (preferredProvider === "auto" && razorpayActive);

  if (useRazorpay) {
    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    const receipt = `JN-ORD-${Date.now().toString(36).toUpperCase()}`;

    const rzpOrder = await createRazorpayOrder({
      keyId,
      keySecret,
      amountPaise,
      currency: "INR",
      receipt,
      notes: {
        docketNumber: docketNumber || "PENDING_FILING",
        track,
        partyName,
        baseFee: feeCalc.baseFee,
        gstAmount: feeCalc.gstAmount,
        registryShare: feeCalc.registryFee,
        neutralShare: feeCalc.neutralHonorarium
      }
    });

    return {
      success: true,
      provider: "razorpay",
      keyId: process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || keyId,
      orderId: rzpOrder.orderId,
      amountPaise: rzpOrder.amountPaise,
      amountInr: totalInr,
      currency: "INR",
      receipt: rzpOrder.receipt,
      docketNumber,
      breakdown,
      customer: {
        name: partyName,
        email: partyEmail,
        phone: partyPhone
      }
    };
  }

  // Fallback to Institutional Bank Transfer / Offline Invoice
  const invoiceOrder = createInstitutionalInvoiceOrder({
    amountPaise,
    docketNumber,
    partyName,
    track,
    breakdown
  });

  return invoiceOrder;
}

/**
 * Verifies a completed payment transaction
 */
export function verifyPaymentTransaction({ provider = "razorpay", orderId, paymentId, signature }) {
  if (provider === "razorpay") {
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!keySecret) {
      // In test/mock mode without keys
      return {
        isValid: true,
        mockVerification: true,
        orderId,
        paymentId,
        verifiedAt: new Date().toISOString()
      };
    }
    return verifyRazorpayPaymentSignature({ orderId, paymentId, signature, keySecret });
  }

  return {
    isValid: true,
    provider: "institutional_invoice",
    orderId,
    verifiedAt: new Date().toISOString()
  };
}
