import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/cron/release-earnings
 * 
 * Vercel Cron Job — runs daily at midnight IST.
 * Finds all WalletTransactions where:
 *   - status = "pending"
 *   - releaseAt <= now()
 * 
 * Moves amounts to availableBalance atomically.
 * 
 * Secure this endpoint using CRON_SECRET env variable.
 * In vercel.json: { "crons": [{ "path": "/api/cron/release-earnings", "schedule": "0 18 * * *" }] }
 */
export async function GET(req: Request) {
  // Security: Only allow Vercel cron runner (or your own cron secret)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Find all pending transactions that are due for release
  const dueTransactions = await prisma.walletTransaction.findMany({
    where: {
      status: "pending",
      type: "sale_credit",
      releaseAt: { lte: now },
    },
    select: {
      id: true,
      walletId: true,
      userId: true,
      amount: true,
    },
  });

  if (dueTransactions.length === 0) {
    console.log("[Cron] No transactions due for release.");
    return NextResponse.json({ released: 0 });
  }

  let releasedCount = 0;
  let totalReleased = 0;

  // Process each transaction atomically
  for (const txn of dueTransactions) {
    try {
      await prisma.$transaction([
        // 1. Mark transaction as available
        prisma.walletTransaction.update({
          where: { id: txn.id },
          data: { status: "available" },
        }),
        // 2. Move from pendingBalance → availableBalance
        prisma.wallet.update({
          where: { id: txn.walletId },
          data: {
            pendingBalance: { decrement: Number(txn.amount) },
            availableBalance: { increment: Number(txn.amount) },
          },
        }),
      ]);

      releasedCount++;
      totalReleased += Number(txn.amount);
      console.log(`[Cron] Released ₹${txn.amount} for wallet ${txn.walletId}`);
    } catch (err: any) {
      console.error(`[Cron] Failed to release txn ${txn.id}:`, err.message);
    }
  }

  console.log(`[Cron] ✅ Released ${releasedCount} transactions totalling ₹${totalReleased}`);
  return NextResponse.json({ released: releasedCount, totalReleased });
}
