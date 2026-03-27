import { Cashfree } from "cashfree-pg";

// Initialize Cashfree PG
Cashfree.XClientId = process.env.CASHFREE_APP_ID || "";
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY || "";
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX; // Change to PRODUCTION for launch

export const cashfree = Cashfree;

/**
 * Payout API Client (Axios-based since SDK might not cover Payouts v1 fully)
 */
import axios from "axios";

const PAYOUT_BASE_URL = "https://payout-gamma.cashfree.com"; // Sandbox

const payoutClient = axios.create({
  baseURL: PAYOUT_BASE_URL,
  headers: {
    "X-Client-Id": process.env.CASHFREE_APP_ID,
    "X-Client-Secret": process.env.CASHFREE_SECRET_KEY,
    "Content-Type": "application/json",
  },
});

export const cashfreePayout = {
  async addBeneficiary(data: {
    beneId: string;
    name: string;
    email: string;
    phone: string;
    bankAccount: string;
    ifsc: string;
    address1: string;
  }) {
    return payoutClient.post("/payout/v1/addBeneficiary", data);
  },

  async requestTransfer(data: {
    beneId: string;
    amount: number;
    transferId: string;
    transferMode: string;
  }) {
    return payoutClient.post("/payout/v1/requestTransfer", data);
  },

  async getBeneficiary(beneId: string) {
    return payoutClient.get(`/payout/v1/getBeneficiary/${beneId}`);
  }
};
