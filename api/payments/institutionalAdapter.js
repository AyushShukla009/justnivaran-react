/**
 * JustNivaran ODR — Institutional & Offline Payment Adapter
 * Handles direct bank wire (NEFT/RTGS/IMPS) and institutional billing accounts.
 */

import crypto from "crypto";

export function createInstitutionalInvoiceOrder({ amountPaise, docketNumber, partyName, track = "arbitration", breakdown = {} }) {
  const invoiceId = `JN-INV-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  const totalInr = Math.round(amountPaise / 100);

  return {
    success: true,
    provider: "institutional_invoice",
    orderId: invoiceId,
    amountPaise,
    amountInr: totalInr,
    currency: "INR",
    docketNumber: docketNumber || "PENDING_FILING",
    partyName: partyName || "Institutional Party",
    track,
    status: "INVOICE_GENERATED",
    bankTransferDetails: {
      accountName: "JustNivaran Private Limited",
      bankName: "HDFC Bank Limited",
      accountNumber: "50200088991122",
      ifscCode: "HDFC0000249",
      branch: "Janakpuri District Centre, New Delhi 110058",
      virtualPaymentReference: `JN-${invoiceId.slice(-8)}`
    },
    breakdown,
    createdAt: new Date().toISOString()
  };
}
