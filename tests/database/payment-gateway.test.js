/**
 * Comprehensive Test Suite for JustNivaran Payment Gateway Adapter
 * Tests:
 * 1. Order Creation & Version 2.4 GST/Fee Sizing
 * 2. HMAC-SHA256 Signature Verification & Anti-Tamper Security
 * 3. Webhook Signature Validation
 * 4. 35% Registry / 65% Neutral Fee Allocation
 * 5. Institutional Offline Bank Transfer Fallback
 */

import crypto from "crypto";
import { calculateAuthoritativeFee } from "../../src/lib/feeSchedule.js";
import {
  verifyRazorpayPaymentSignature,
  verifyRazorpayWebhookSignature
} from "../../api/payments/razorpayAdapter.js";
import {
  initializePaymentOrder,
  verifyPaymentTransaction
} from "../../api/payments/paymentService.js";
import { createInstitutionalInvoiceOrder } from "../../api/payments/institutionalAdapter.js";

async function runPaymentGatewayTests() {
  console.log("=================================================================");
  console.log("   JUSTNIVARAN PAYMENT GATEWAY ADAPTER — TEST SUITE             ");
  console.log("=================================================================\n");

  let totalTests = 0;
  let passedTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (!condition) {
      console.error(`  [FAIL] ${message}`);
      throw new Error(`Payment Gateway Test Failure: ${message}`);
    }
    passedTests++;
    console.log(`  [PASS] ${message}`);
  }

  // 1. Fee Calculation & Order Sizing
  console.log("--> Section 1: Fee Calculation & Order Sizing...");
  const fee10L = calculateAuthoritativeFee(1000000, "arbitration");
  assert(fee10L.baseFee === 35000, `₹10L Claim Base Fee = ₹35,000 (got ${fee10L.baseFee})`);
  assert(fee10L.gstAmount === 6300, `₹10L Claim GST (18%) = ₹6,300 (got ${fee10L.gstAmount})`);
  assert(fee10L.totalWithGst === 41300, `₹10L Claim Total Payable = ₹41,300 (got ${fee10L.totalWithGst})`);
  assert(fee10L.registryFee === 12250, `35% Registry Split = ₹12,250 (got ${fee10L.registryFee})`);
  assert(fee10L.neutralHonorarium === 22750, `65% Neutral Split = ₹22,750 (got ${fee10L.neutralHonorarium})`);

  // 2. Institutional Invoice Mode (Default / Offline)
  console.log("\n--> Section 2: Institutional Bank Transfer Fallback Mode...");
  const invoiceOrder = createInstitutionalInvoiceOrder({
    amountPaise: 4130000,
    docketNumber: "JN-2026-ARB-8812",
    partyName: "Acme Industrial Ltd",
    track: "arbitration",
    breakdown: fee10L
  });

  assert(invoiceOrder.success === true, "Institutional invoice order created successfully");
  assert(invoiceOrder.amountInr === 41300, `Invoice amount in INR = ₹41,300 (got ${invoiceOrder.amountInr})`);
  assert(invoiceOrder.bankTransferDetails.accountNumber === "50200088991122", "HDFC bank account configured");
  assert(invoiceOrder.bankTransferDetails.ifscCode === "HDFC0000249", "IFSC Code configured");
  assert(Boolean(invoiceOrder.bankTransferDetails.virtualPaymentReference), "Virtual reference generated");

  // 3. HMAC-SHA256 Payment Signature Verification
  console.log("\n--> Section 3: Cryptographic Payment Signature Verification...");
  const testSecret = "rzp_secret_mock_testing_key_2026";
  const testOrderId = "order_O8xG7yZ1ABC";
  const testPaymentId = "pay_P9yH8zA2XYZ";

  const validSignature = crypto
    .createHmac("sha256", testSecret)
    .update(`${testOrderId}|${testPaymentId}`)
    .digest("hex");

  const validResult = verifyRazorpayPaymentSignature({
    orderId: testOrderId,
    paymentId: testPaymentId,
    signature: validSignature,
    keySecret: testSecret
  });
  assert(validResult.isValid === true, "Valid cryptographic HMAC-SHA256 signature accepted");

  // Tampered payment signature test
  const tamperedSignature = validSignature.slice(0, -2) + "00";
  const tamperedResult = verifyRazorpayPaymentSignature({
    orderId: testOrderId,
    paymentId: testPaymentId,
    signature: tamperedSignature,
    keySecret: testSecret
  });
  assert(tamperedResult.isValid === false, "Tampered payment signature strictly rejected");

  // Missing parameters test
  const missingResult = verifyRazorpayPaymentSignature({
    orderId: "",
    paymentId: testPaymentId,
    signature: validSignature,
    keySecret: testSecret
  });
  assert(missingResult.isValid === false, "Missing order ID rejected");

  // 4. Webhook HMAC-SHA256 Signature Verification
  console.log("\n--> Section 4: Webhook Signature Verification...");
  const webhookSecret = "whsec_test_secret_998877";
  const webhookPayload = JSON.stringify({
    event: "payment.captured",
    payload: {
      payment: {
        entity: {
          id: "pay_TEST123",
          order_id: "order_TEST456",
          amount: 4130000
        }
      }
    }
  });

  const validWebhookSig = crypto
    .createHmac("sha256", webhookSecret)
    .update(webhookPayload)
    .digest("hex");

  const webhookCheck = verifyRazorpayWebhookSignature({
    rawBody: webhookPayload,
    webhookSignature: validWebhookSig,
    webhookSecret
  });
  assert(webhookCheck === true, "Valid webhook HMAC signature verified");

  const spoofedWebhookCheck = verifyRazorpayWebhookSignature({
    rawBody: webhookPayload,
    webhookSignature: "spoofed_signature_value_12345",
    webhookSecret
  });
  assert(spoofedWebhookCheck === false, "Spoofed webhook signature rejected");

  // 5. Unified Service Initialization
  console.log("\n--> Section 5: Unified Payment Service Initialization...");
  const orderResult = await initializePaymentOrder({
    claimAmount: 1000000,
    track: "arbitration",
    docketNumber: "JN-2026-ARB-9900",
    partyName: "Test Party Corp",
    partyEmail: "claimant@test.org",
    partyPhone: "+919876543210"
  });

  assert(orderResult.success === true, "initializePaymentOrder executed successfully");
  assert(Boolean(orderResult.orderId), `Generated Order ID: ${orderResult.orderId}`);
  assert(Boolean(orderResult.breakdown), "Fee breakdown attached to order");

  console.log("\n=================================================================");
  console.log(`   ALL PAYMENT GATEWAY TESTS PASSED: ${passedTests}/${totalTests} (100%)  `);
  console.log("=================================================================\n");
  return true;
}

runPaymentGatewayTests().catch((err) => {
  console.error("\n[PAYMENT TEST FAILED]:", err.message);
  process.exit(1);
});
