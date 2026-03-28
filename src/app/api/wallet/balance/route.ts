import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Upsert wallet so every user always has one
  const wallet = await (prisma as any).wallet.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      pendingBalance: 0,
      availableBalance: 0,
      totalEarned: 0,
    },
    include: {
      transactions: {
        where: {
          type: { in: ["sale_credit", "payout_debit", "refund_debit"] },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  return NextResponse.json({
    pendingBalance: Number(wallet.pendingBalance),
    availableBalance: Number(wallet.availableBalance),
    totalEarned: Number(wallet.totalEarned),
    transactions: wallet.transactions.map((t: any) => ({
      id: t.id,
      type: t.type,
      amount: Number(t.amount),
      status: t.status,
      createdAt: t.createdAt,
      promptId: t.promptId,
    })),
  });
}
