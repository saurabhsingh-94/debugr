import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// Admin-only endpoint to repair missing Purchase records for paid transactions
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });

  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Find all SUCCESS transactions that don't have a corresponding Purchase
  const successTxns = await prisma.transaction.findMany({
    where: { status: "SUCCESS" },
    select: { id: true, userId: true, promptId: true, amount: true },
  });

  let created = 0;
  let skipped = 0;
  let earningsCreated = 0;

  for (const txn of successTxns) {
    // Check if Purchase already exists
    const existing = await prisma.purchase.findUnique({
      where: { userId_promptId: { userId: txn.userId, promptId: txn.promptId } },
    });

    if (!existing) {
      await prisma.purchase.create({
        data: { userId: txn.userId, promptId: txn.promptId },
      });
      created++;

      // Also ensure CreatorEarning exists
      const prompt = await prisma.prompt.findUnique({
        where: { id: txn.promptId },
        select: { authorId: true },
      });

      if (prompt) {
        const existingEarning = await prisma.creatorEarning.findFirst({
          where: { userId: prompt.authorId, promptId: txn.promptId },
        });

        if (!existingEarning) {
          await prisma.creatorEarning.create({
            data: {
              userId: prompt.authorId,
              promptId: txn.promptId,
              amount: txn.amount * 0.8,
              status: "PENDING",
            },
          });
          earningsCreated++;
        }
      }
    } else {
      skipped++;
    }
  }

  return NextResponse.json({
    message: "Repair complete",
    totalTransactions: successTxns.length,
    purchasesCreated: created,
    purchasesSkipped: skipped,
    earningsCreated,
  });
}
