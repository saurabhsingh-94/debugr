import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

/**
 * GET /api/wallet/balance
 * Returns creator's live wallet balances and recent transaction history.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          amount: true,
          platformFee: true,
          type: true,
          status: true,
          source: true,
          orderId: true,
          promptId: true,
          releaseAt: true,
          createdAt: true,
        },
      },
    },
  });

  if (!wallet) {
    return NextResponse.json({
      pendingBalance: 0,
      availableBalance: 0,
      totalEarned: 0,
      transactions: [],
    });
  }

  return NextResponse.json({
    pendingBalance: Number(wallet.pendingBalance),
    availableBalance: Number(wallet.availableBalance),
    totalEarned: Number(wallet.totalEarned),
    transactions: wallet.transactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
      platformFee: Number(t.platformFee),
    })),
  });
}
