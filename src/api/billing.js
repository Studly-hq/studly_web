import client from "./client";

export const initializePayment = async () => {
    try {
        const callbackUrl = encodeURIComponent(`${window.location.origin}/verify-payment`);
        const response = await client.post(`/billing/paystack/initialize?callback_url=${callbackUrl}`);
        return response.data;
    } catch (error) {
        console.error("Initialize payment error:", error);
        throw error;
    }
};

export const verifyPayment = async (reference) => {
    try {
        const response = await client.get(`/billing/paystack/verify?reference=${reference}`);
        return response.data;
    } catch (error) {
        console.error("Verify payment error:", error);
        throw error;
    }
};

export const getQuota = async () => {
    try {
        const response = await client.get('/billing/quota');
        return response.data;
    } catch (error) {
        console.error("Get quota error:", error);
        throw error;
    }
};
