import client from "./client";

/**
 * Billing API
 *
 * Studly Pro is a one time payment that grants 30 days of access. There is no
 * recurring plan on Paystack, so there is nothing to cancel or manage. The UI
 * therefore only needs: current entitlement, usage counters, and the payment
 * ledger.
 */

/** Start a Paystack checkout. Returns { authorization_url, access_code, reference }. */
export const initializePayment = async () => {
  try {
    const callbackUrl = encodeURIComponent(`${window.location.origin}/verify-payment`);
    const response = await client.post(
      `/billing/paystack/initialize?callback_url=${callbackUrl}`,
    );
    return response.data;
  } catch (error) {
    console.error("Initialize payment error:", error);
    throw error;
  }
};

/** Verify a Paystack reference and extend the entitlement. Safe to call twice. */
export const verifyPayment = async (reference) => {
  try {
    const response = await client.get(
      `/billing/paystack/verify?reference=${encodeURIComponent(reference)}`,
    );
    return response.data;
  } catch (error) {
    console.error("Verify payment error:", error);
    throw error;
  }
};

/**
 * Everything the billing page needs in one request: plan, period window,
 * price, first month eligibility, and the payment ledger.
 */
export const getBillingOverview = async () => {
  try {
    const response = await client.get("/billing/overview");
    return response.data;
  } catch (error) {
    console.error("Get billing overview error:", error);
    throw error;
  }
};

/** Live usage counters (uploads and AI actions) plus plan state. */
export const getQuota = async () => {
  try {
    const response = await client.get("/billing/quota");
    return response.data;
  } catch (error) {
    console.error("Get quota error:", error);
    throw error;
  }
};

/** Redeem a one time voucher code for Pro access. */
export const redeemVoucher = async (code) => {
  try {
    const response = await client.post("/billing/voucher/redeem", {
      code: code.trim().toUpperCase(),
    });
    return response.data;
  } catch (error) {
    console.error("Redeem voucher error:", error);
    throw error;
  }
};
