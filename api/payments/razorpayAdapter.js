/**
 * JustNivaran ODR — Razorpay Payment Gateway Adapter
 * Standard REST API implementation without external binary dependencies.
 * Handles:
 * 1. Server-side Order Creation (POST /v1/orders)
 * 2. HMAC-SHA256 Client Payment Signature Verification
 * 3. HMAC-SHA256 Webhook Payload Signature Verification
 */

import crypto from "crypto";

const RAZORPAY_API_BASE = "https://api.razorpay.com/v1";

/**
 * Creates a Razorpay payment order
 * @param {object} params
 * @param {string} params.keyId - Razorpay Key ID (rzp_test_... / rzp_live_...)
 * @param {string} params.keySecret - Razorpay Key Secret
 * @param {number} params.amountPaise - Amount in Indian Paise (e.g. ₹41,300 = 4130000)
 * @param {string} params.currency - "INR"
 * @param {string} params.receipt - Internal receipt ID (e.g. "JN-ORD-2026-ARB-1001")
 * @param {object} params.notes - Metadata dictionary (docket, party, track, gst)
 * @returns {Promise<object>} Razorpay order response
 */
export async function createRazorpayOrder({ keyId, keySecret, amountPaise, currency = "INR", receipt, notes = {} }) {
  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_CREDENTIALS_MISSING: Both keyId and keySecret are required.");
  }

  if (!amountPaise || isNaN(amountPaise) || amountPaise <= 0) {
    throw new Error("INVALID_AMOUNT: Amount in paise must be a positive integer.");
  }

  const authHeader = "Basic " + Buffer.from(`${keyId.trim()}:${keySecret.trim()}`).toString("base64");

  const payload = {
    amount: Math.round(amountPaise),
    currency: currency.toUpperCase(),
    receipt: String(receipt || `JN-ORD-${Date.now()}`).slice(0, 40),
    payment_capture: 1, // Automatic capture upon successful auth
    notes: {
      platform: "JustNivaran ODR",
      ...notes
    }
  };

  const response = await fetch(`${RAZORPAY_API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error?.description || data?.error?.reason || `HTTP_${response.status}`;
    const error = new Error(`Razorpay Order API Error: ${errorMsg}`);
    error.status = response.status;
    error.details = data?.error;
    throw error;
  }

  return {
    success: true,
    orderId: data.id,
    amountPaise: data.amount,
    currency: data.currency,
    receipt: data.receipt,
    status: data.status,
    createdAt: data.created_at
  };
}

/**
 * Cryptographically verifies the Razorpay payment signature returned by Checkout.js
 * Algorithm: HMAC-SHA256(order_id + "|" + razorpay_payment_id, key_secret) === razorpay_signature
 */
export function verifyRazorpayPaymentSignature({ orderId, paymentId, signature, keySecret }) {
  if (!orderId || !paymentId || !signature || !keySecret) {
    return {
      isValid: false,
      error: "MISSING_SIGNATURE_PARAMETERS",
      message: "Order ID, Payment ID, Signature, and Key Secret are required for verification."
    };
  }

  const body = `${orderId.trim()}|${paymentId.trim()}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret.trim())
    .update(body)
    .digest("hex");

  // Constant-time string comparison to prevent timing attacks
  const isValid = crypto.timingSafeEqual(
    Buffer.from(expectedSignature, "utf-8"),
    Buffer.from(signature.trim(), "utf-8")
  );

  return {
    isValid,
    orderId,
    paymentId,
    verifiedAt: new Date().toISOString()
  };
}

/**
 * Validates inbound Razorpay Webhook HMAC-SHA256 Signature
 * Header: X-Razorpay-Signature
 */
export function verifyRazorpayWebhookSignature({ rawBody, webhookSignature, webhookSecret }) {
  if (!rawBody || !webhookSignature || !webhookSecret) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", webhookSecret.trim())
    .update(typeof rawBody === "string" ? rawBody : JSON.stringify(rawBody))
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "utf-8"),
      Buffer.from(webhookSignature.trim(), "utf-8")
    );
  } catch {
    return false;
  }
}
