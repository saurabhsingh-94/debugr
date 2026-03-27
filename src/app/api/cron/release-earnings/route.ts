import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/cron/release-earnings
 *
 * Runs every hour via Vercel Cron.
 * Condition-based only: releaseAt <= now (no time-of-day dependency).
 *
 * A transaction at 11:31 PM will be released by 12:31 AM at most.
 * Never misses by more than 1 hour regardless of when it was created.
 */
export async function GET(req: Request) {
  // Security: Vercel passes CRON_SECRET as Bearer token automatically
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // ── Find all pending transactions where release date has passed ──────────
  const dueTransactions = await (prisma as any).walletTransaction.findMany({
    where: {
      type:      "sale_credit",
      status:    "pending",
      releaseAt: { lte: now },   // ONLY condition — date-based, not time-based
    },
    select: {
      id:       true,
      walletId: true,
      userId:   true,
      amount:   true,
    },
  });

  if (dueTransactions.length === 0) {
    return NextResponse.json({ released: 0, message: "No transactions due." });
  }

  let releasedCount = 0;
  let totalReleased = 0;
  const errors: string[] = [];

  for (const txn of dueTransactions) {
    try {
      await prisma.$transaction([
        // 1. Mark this transaction as available
        (prisma as any).walletTransaction.update({
          where: { id: txn.id },
          data:  { status: "available" },
        }),
        // 2. Atomically move pending → available on the wallet
        (prisma as any).wallet.update({
          where: { id: txn.walletId },
          data: {
            pendingBalance:   { decrement: Number(txn.amount) },
            availableBalance: { increment: Number(txn.amount) },
          },
        }),
      ]);

      releasedCount++;
      totalReleased += Number(txn.amount);
    } catch (err: any) {
      console.error(`[Cron] Failed txn ${txn.id}:`, err.message);
      errors.push(txn.id);
    }
  }

  console.log(`[Cron] ✅ Released ${releasedCount} txns | Total: ₹${totalReleased.toFixed(2)} | Errors: ${errors.length}`);

  return NextResponse.json({
    released:       releasedCount,
    totalReleased:  parseFloat(totalReleased.toFixed(2)),
    errors:         errors.length,
    checkedAt:      now.toISOString(),
  });
}
