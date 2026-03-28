import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ pendingBalance: 0, availableBalance: 0, totalEarned: 0, transactions: [] });
  }

  const userId = session.user.id;

  try {
    const [earningsAgg, recentEarnings] = await Promise.all([
      prisma.creatorEarning.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),
      prisma.creatorEarning.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { id: true, amount: true, status: true, createdAt: true, promptId: true },
      }),
    ]);

    const totalEarned = Number(earningsAgg._sum.amount || 0);

    return NextResponse.json({
      pendingBalance: 0,
      availableBalance: totalEarned,
      totalEarned,
      transactions: recentEarnings.map((e) => ({
        id: e.id,
        type: "sale_credit",
        amount: Number(e.amount),
        status: e.status === "PAID" ? "available" : "pending",
        createdAt: e.createdAt,
        promptId: e.promptId,
      })),
    });
  } catch {
    return NextResponse.json({ pendingBalance: 0, availableBalance: 0, totalEarned: 0, transactions: [] });
  }
}
