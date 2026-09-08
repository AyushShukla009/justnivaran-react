/**
 * Serverless Webhook Handler: /api/payment-webhook
 * Processes asynchronous payment callbacks from payment providers (Razorpay / Gateway).
 */

import { verifyRazorpayWebhookSignature } from "./payments/razorpayAdapter.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  const signature = req.headers["x-razorpay-signature"] || "";

  // If secret is set, strictly verify HMAC-SHA256 signature
  if (webhookSecret) {
    const rawBody = req.body;
    const isValid = verifyRazorpayWebhookSignature({
      rawBody,
      webhookSignature: signature,
      webhookSecret
    });

    if (!isValid) {
      console.warn("[Payment Webhook] Unauthorized webhook signature received.");
      return res.status(401).json({ success: false, error: "INVALID_WEBHOOK_SIGNATURE" });
    }
  }

  const payload = req.body || {};
  const event = payload.event || "unknown.event";

  console.log(`[Payment Webhook Event] Received verified event: ${event}`);

  // Handle standard payment events
  switch (event) {
    case "payment.captured": {
      const paymentEntity = payload.payload?.payment?.entity || {};
      const orderId = paymentEntity.order_id;
      const amountPaise = paymentEntity.amount;
      console.log(`[Payment Captured] Order ${orderId} paid: INR ${amountPaise / 100}`);
      break;
    }
    case "payment.failed": {
      const paymentEntity = payload.payload?.payment?.entity || {};
      console.warn(`[Payment Failed] Error: ${paymentEntity.error_description || "Declined by bank"}`);
      break;
    }
    case "order.paid": {
      const orderEntity = payload.payload?.order?.entity || {};
      console.log(`[Order Paid] Order ${orderEntity.id} completed.`);
      break;
    }
    default:
      console.log(`[Payment Webhook] Unhandled event category: ${event}`);
  }

  return res.status(200).json({
    success: true,
    receivedEvent: event,
    processedAt: new Date().toISOString()
  });
}
