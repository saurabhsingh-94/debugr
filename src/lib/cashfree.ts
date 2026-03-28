// Cashfree API Helpers

const getCashfreeBaseUrl = () => {
  return process.env.CASHFREE_MODE === "sandbox" 
    ? "https://sandbox.cashfree.com/pg/orders" 
    : "https://api.cashfree.com/pg/orders";
};

export const createCashfreeOrder = async (orderData: any) => {
  const url = getCashfreeBaseUrl();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "x-client-id": process.env.CASHFREE_APP_ID || "",
      "x-client-secret": process.env.CASHFREE_SECRET_KEY || "",
      "x-api-version": "2023-08-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();
  console.log("Cashfree dynamic response:", JSON.stringify(data, null, 2));

  if (!response.ok) {
    throw new Error(data.message || "Failed to create Cashfree order");
  }

  return data;
};

/**
 * Payout API Client
 */
const PAYOUT_BASE_URL = "https://payout-api.cashfree.com"; // Production

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
