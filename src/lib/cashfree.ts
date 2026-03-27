import axios from "axios";

const CASHFREE_BASE_URL = "https://sandbox.cashfree.com/pg/orders"; // Sandbox

export const createCashfreeOrder = async (orderData: any) => {
  const response = await fetch(CASHFREE_BASE_URL, {
    method: "POST",
    headers: {
      "x-client-id": process.env.CASHFREE_APP_ID || "",
      "x-client-secret": process.env.CASHFREE_SECRET_KEY || "",
      "x-api-version": "2023-08-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create Cashfree order");
  }

  return response.json();
};

/**
 * Payout API Client
 */
const PAYOUT_BASE_URL = "https://payout-gamma.cashfree.com"; // Sandbox

const payoutHeaders = {
  "X-Client-Id": process.env.CASHFREE_APP_ID || "",
  "X-Client-Secret": process.env.CASHFREE_SECRET_KEY || "",
  "Content-Type": "application/json",
};

export const cashfreePayout = {
  async addBeneficiary(data: any) {
    const response = await fetch(`${PAYOUT_BASE_URL}/payout/v1/addBeneficiary`, {
      method: "POST",
      headers: payoutHeaders,
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async requestTransfer(data: any) {
    const response = await fetch(`${PAYOUT_BASE_URL}/payout/v1/requestTransfer`, {
      method: "POST",
      headers: payoutHeaders,
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getBeneficiary(beneId: string) {
    const response = await fetch(`${PAYOUT_BASE_URL}/payout/v1/getBeneficiary/${beneId}`, {
      method: "GET",
      headers: payoutHeaders,
    });
    return response.json();
  }
};
