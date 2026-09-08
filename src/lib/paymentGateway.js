/**
 * JustNivaran ODR — Client-Side Payment Gateway Interface
 * Modular integration supporting Razorpay Checkout & Institutional Bank Transfer.
 * Zero initial bundle overhead (dynamically loads script on-demand).
 */

const RAZORPAY_CHECKOUT_URL = "https://checkout.razorpay.com/v1/checkout.js";

/**
 * Dynamically loads the official Razorpay Checkout.js script
 */
export function loadRazorpayCheckoutScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_CHECKOUT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn("Failed to load Razorpay Checkout script. Falling back to institutional offline payment.");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Creates a payment order via backend API (/api/payment-order)
 */
export async function createPaymentOrder({
  claimAmount,
  track = "arbitration",
  docketNumber = "",
  partyName = "Claimant",
  partyEmail = "",
  partyPhone = "",
  preferredProvider = "auto"
}) {
  try {
    const res = await fetch("/api/payment-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_order",
        claimAmount,
        track,
        docketNumber,
        partyName,
        partyEmail,
        partyPhone,
        preferredProvider
      })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Payment Order Error: HTTP_${res.status}`);
    }
    return data;
  } catch (err) {
    console.error("[Payment Gateway] Order creation error:", err);
    throw err;
  }
}

/**
 * Verifies payment signature on the backend (/api/payment-order)
 */
export async function verifyPaymentOnServer({ orderId, paymentId, signature, provider = "razorpay" }) {
  try {
    const res = await fetch("/api/payment-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify_payment",
        orderId,
        paymentId,
        signature,
        provider
      })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || "Payment verification failed.");
    }
    return data;
  } catch (err) {
    console.error("[Payment Gateway] Verification error:", err);
    throw err;
  }
}

/**
 * Check backend payment gateway configuration status
 */
export async function checkPaymentGatewayStatus() {
  try {
    const res = await fetch("/api/payment-order", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    return await res.json();
  } catch {
    return {
      success: false,
      configured: false,
      message: "Gateway endpoint currently in standby mode."
    };
  }
}

/**
 * Opens Razorpay Checkout Modal or triggers Institutional Bank Transfer fallback
 */
export async function initiateODRPayment({
  claimAmount,
  track = "arbitration",
  docketNumber,
  partyName,
  partyEmail,
  partyPhone,
  onSuccess,
  onFailure,
  onDismiss
}) {
  try {
    // 1. Create order on server
    const order = await createPaymentOrder({
      claimAmount,
      track,
      docketNumber,
      partyName,
      partyEmail,
      partyPhone
    });

    // 2. Handle Institutional Offline Invoice Provider
    if (order.provider === "institutional_invoice") {
      if (typeof onSuccess === "function") {
        onSuccess({
          mode: "institutional_invoice",
          orderId: order.orderId,
          amountInr: order.amountInr,
          bankDetails: order.bankTransferDetails,
          breakdown: order.breakdown,
          message: "Institutional Invoice generated for direct NEFT/RTGS bank transfer."
        });
      }
      return;
    }

    // 3. Handle Razorpay Gateway
    const scriptLoaded = await loadRazorpayCheckoutScript();
    if (!scriptLoaded || !window.Razorpay) {
      throw new Error("Unable to initialize secure Razorpay gateway interface. Please try institutional bank transfer.");
    }

    const options = {
      key: order.keyId,
      amount: order.amountPaise,
      currency: order.currency || "INR",
      name: "JustNivaran ODR",
      description: `Dispute Resolution Registry Fee (${docketNumber || track.toUpperCase()})`,
      order_id: order.orderId,
      prefill: {
        name: partyName || "",
        email: partyEmail || "",
        contact: partyPhone || ""
      },
      notes: {
        docketNumber: docketNumber || "PENDING",
        track
      },
      theme: {
        color: "#0B1B31"
      },
      handler: async function (response) {
        try {
          // Verify signature on server
          const verification = await verifyPaymentOnServer({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            provider: "razorpay"
          });

          if (typeof onSuccess === "function") {
            onSuccess({
              mode: "razorpay",
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              verified: true,
              breakdown: order.breakdown,
              serverData: verification
            });
          }
        } catch (verifErr) {
          if (typeof onFailure === "function") {
            onFailure(verifErr);
          }
        }
      },
      modal: {
        ondismiss: function () {
          if (typeof onDismiss === "function") {
            onDismiss();
          }
        }
      }
    };

    const rzpInstance = new window.Razorpay(options);
    rzpInstance.on("payment.failed", function (response) {
      if (typeof onFailure === "function") {
        onFailure(new Error(response.error?.description || "Payment failed at bank gateway."));
      }
    });
    rzpInstance.open();
  } catch (err) {
    if (typeof onFailure === "function") {
      onFailure(err);
    } else {
      console.error("[ODR Payment Error]:", err);
    }
  }
}
