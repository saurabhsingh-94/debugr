// Cashfree API Helpers

const isProd = process.env.CASHFREE_ENV === "PROD";

const getPGUrl = () => {
  return isProd
    ? "https://api.cashfree.com/pg/orders"
    : "https://sandbox.cashfree.com/pg/orders";
};

const getPayoutUrl = () => {
  return isProd
    ? "https://payout-api.cashfree.com/payout/v1"
    : "https://payout-gamma.cashfree.com/payout/v1";
};

const getAuthHeaders = () => ({
  "x-client-id": process.env.CASHFREE_APP_ID || "",
  "x-client-secret": process.env.CASHFREE_SECRET_KEY || "",
  "x-api-version": "2023-08-01",
  "Content-Type": "application/json",
});

const getPayoutHeaders = () => ({
  "X-Client-Id": process.env.CASHFREE_APP_ID || "",
  "X-Client-Secret": process.env.CASHFREE_SECRET_KEY || "",
  "Content-Type": "application/json",
});

export const createCashfreeOrder = async (orderData: any) => {
  const url = getPGUrl();
  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "CF PG: Order failed");
  return data;
};

export const getCashfreeOrder = async (orderId: string) => {
  const url = `${getPGUrl()}/${orderId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "CF PG: Fetch failed");
  return data;
};

export const cashfreePayout = {
  async addBeneficiary(data: any) {
    const response = await fetch(`${getPayoutUrl()}/addBeneficiary`, {
      method: "POST",
      headers: getPayoutHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async requestTransfer(data: any) {
    const response = await fetch(`${getPayoutUrl()}/requestTransfer`, {
      method: "POST",
      headers: getPayoutHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getBeneficiary(beneId: string) {
    const response = await fetch(`${getPayoutUrl()}/getBeneficiary/${beneId}`, {
      method: "GET",
      headers: getPayoutHeaders(),
    });
    return response.json();
  }
};
