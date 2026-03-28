import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCashfreeOrder } from "@/lib/cashfree";

const CREATOR_SHARE = 0.80;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
  }

  try {
    // 1. Check current status in DB
    const transaction = await prisma.transaction.findUnique({
      where: { orderId },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Already processed — just confirm access exists
    if (transaction.status === "SUCCESS") {
      const purchase = await prisma.purchase.findUnique({
        where: { userId_promptId: { userId: transaction.userId, promptId: transaction.promptId } },
      });
      // If purchase record is missing for some reason, create it
      if (!purchase) {
        await prisma.purchase.create({
          data: { userId: transaction.userId, promptId: transaction.promptId },
        });
      }
      revalidatePath("/marketplace");
      return NextResponse.json({ status: "SUCCESS", already_processed: true });
    }

    // 2. Fetch real-time status from Cashfree
    const cfOrder = await getCashfreeOrder(orderId);

    if (cfOrder.order_status !== "PAID") {
      return NextResponse.json({
        status: transaction.status,
        cf_status: cfOrder.order_status,
        message: "Payment not completed yet",
      });
    }

    // 3. Payment confirmed — fulfill atomically
    const rawAmount = Number(cfOrder.order_amount);
    const creatorShare = parseFloat((rawAmount * CREATOR_SHARE).toFixed(2));

    const prompt = await prisma.prompt.findUnique({
      where: { id: transaction.promptId },
      select: { authorId: true, title: true },
    });

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      // Mark transaction SUCCESS
      await tx.transaction.update({
        where: { id: transaction.id },
        data: { status: "SUCCESS", paymentId: "VERIFIED_VIA_API" },
      });

      // Grant buyer access (idempotent)
      await tx.purchase.upsert({
        where: { userId_promptId: { userId: transaction.userId, promptId: transaction.promptId } },
        update: {},
        create: { userId: transaction.userId, promptId: transaction.promptId },
      });

      // Credit creator earnings
      await tx.creatorEarning.create({
        data: {
          userId: prompt.authorId,
          promptId: transaction.promptId,
          amount: creatorShare,
          status: "PENDING",
        },
      });
    });

    // Force Next.js to re-render marketplace with updated purchase state
    revalidatePath("/marketplace");
    revalidatePath("/dashboard");

    return NextResponse.json({ status: "SUCCESS", message: "Purchase fulfilled" });
  } catch (error: any) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
  }
}
