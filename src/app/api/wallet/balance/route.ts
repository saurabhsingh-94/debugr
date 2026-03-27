import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

/**
 * GET /api/wallet/balance
 *
 * Lazy release pattern:
 * Before returning balances, check if any pending transactions have reached
 * their releaseAt date. If so, release them now — atomically.
 *
 * Zero cost. Always accurate. No dependency on cron timing.
 * Cron job remains as a safety net for inactive users only.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const now = new Date();

  // ── LAZY RELEASE: Find pending transactions that are due ──────────────────
  const dueTransactions = await (prisma as any).walletTransaction.findMany({
    where: {
      userId,
      type:      "sale_credit",
      status:    "pending",
      releaseAt: { lte: now },
    },
    select: { id: true, walletId: true, amount: true },
  });

  // Release them atomically if any are due
  if (dueTransactions.length > 0) {
    for (const txn of dueTransactions) {
      try {
        await prisma.$transaction([
          (prisma as any).walletTransaction.update({
            where: { id: txn.id },
            data:  { status: "available" },
          }),
          (prisma as any).wallet.update({
            where: { id: txn.walletId },
            data: {
              pendingBalance:   { decrement: Number(txn.amount) },
              availableBalance: { increment: Number(txn.amount) },
            },
          }),
        ]);
      } catch (err: any) {
        // Non-fatal — log and continue, stale balances are better than a crash
        console.error(`[Wallet] Lazy release failed for txn ${txn.id}:`, err.message);
      }
    }
  }

  // ── FETCH UPDATED WALLET ──────────────────────────────────────────────────
  const wallet = await (prisma as any).wallet.findUnique({
    where: { userId },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id:          true,
          amount:      true,
          platformFee: true,
          type:        true,
          status:      true,
          source:      true,
          orderId:     true,
          promptId:    true,
          releaseAt:   true,
          createdAt:   true,
        },
      },
    },
  });

  if (!wallet) {
    return NextResponse.json({
      pendingBalance:   0,
      availableBalance: 0,
      totalEarned:      0,
      transactions:     [],
      released:         0,
    });
  }

  return NextResponse.json({
    pendingBalance:   Number(wallet.pendingBalance),
    availableBalance: Number(wallet.availableBalance),
    totalEarned:      Number(wallet.totalEarned),
    transactions:     wallet.transactions.map((t: any) => ({
      ...t,
      amount:      Number(t.amount),
      platformFee: Number(t.platformFee),
    })),
    released: dueTransactions.length, // useful for debugging
  });
}
