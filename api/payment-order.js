/**
 * Serverless API Handler: /api/payment-order
 * Provides authenticated/public endpoints for:
 * 1. Payment Order Creation with Version 2.4 GST calculation
 * 2. Payment Signature Verification
 * 3. Provider Configuration Status Probe
 */

import { initializePaymentOrder, verifyPaymentTransaction, isRazorpayConfigured } from "./payments/paymentService.js";

export default async function handler(req, res) {
  // Anti-caching and security headers
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");

  // Health / Config Status Probe
  if (req.method === "GET") {
    const razorpayActive = isRazorpayConfigured();
    return res.status(200).json({
      success: true,
      service: "JustNivaran Payment Gateway Adapter",
      version: "1.0.0",
      feeScheduleVersion: "2.4",
      providers: {
        razorpay: {
          available: true,
          configured: razorpayActive,
          environment: razorpayActive ? "active" : "standby_ready"
        },
        institutional_invoice: {
          available: true,
          configured: true,
          environment: "active"
        }
      },
      message: razorpayActive
        ? "Razorpay Payment Gateway Active"
        : "Payment Gateway in Standby Mode (Institutional Invoice active; ready for Razorpay keys)"
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({
      success: false,
      error: "METHOD_NOT_ALLOWED",
      message: "Only GET and POST methods are supported on this endpoint."
    });
  }

  try {
    const body = req.body || {};
    const action = body.action || "create_order";

    if (action === "create_order") {
      const claimAmount = Number(body.claimAmount);
      if (isNaN(claimAmount) || claimAmount <= 0) {
        return res.status(400).json({
          success: false,
          error: "INVALID_CLAIM_AMOUNT",
          message: "A valid positive claim amount in INR is required."
        });
      }

      const orderResult = await initializePaymentOrder({
        claimAmount,
        track: body.track || "arbitration",
        docketNumber: body.docketNumber || "",
        partyName: body.partyName || "Claimant",
        partyEmail: body.partyEmail || "",
        partyPhone: body.partyPhone || "",
        preferredProvider: body.preferredProvider || "auto"
      });

      return res.status(200).json(orderResult);
    }

    if (action === "verify_payment") {
      const { orderId, paymentId, signature, provider = "razorpay" } = body;

      if (!orderId || !paymentId || !signature) {
        return res.status(400).json({
          success: false,
          error: "MISSING_VERIFICATION_PARAMS",
          message: "orderId, paymentId, and signature are required to verify a payment."
        });
      }

      const verification = verifyPaymentTransaction({
        provider,
        orderId,
        paymentId,
        signature
      });

      if (!verification.isValid) {
        return res.status(400).json({
          success: false,
          error: "PAYMENT_SIGNATURE_INVALID",
          message: "Cryptographic signature verification failed. Transaction cannot be verified."
        });
      }

      return res.status(200).json({
        success: true,
        data: verification,
        message: "Payment successfully verified."
      });
    }

    return res.status(400).json({
      success: false,
      error: "UNKNOWN_ACTION",
      message: `Unsupported action '${action}'. Use 'create_order' or 'verify_payment'.`
    });
  } catch (err) {
    console.error("[Payment Order Handler Error]:", err.message);
    return res.status(500).json({
      success: false,
      error: "PAYMENT_PROCESSING_ERROR",
      message: err.message || "An error occurred during payment processing."
    });
  }
}
