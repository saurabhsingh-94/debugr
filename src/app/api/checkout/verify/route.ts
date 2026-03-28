import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCashfreeOrder } from "@/lib/cashfree";

const CREATOR_SHARE = 0.80;
const PLATFORM_SHARE = 0.20;
const RELEASE_DAYS = 7;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
  }

  try {
    // 1. Check current status in DB
    const transaction = await (prisma.transaction as any).findUnique({
      where: { orderId },
      include: { prompt: true }
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    if (transaction.status === "SUCCESS") {
      return NextResponse.json({ status: "SUCCESS", already_processed: true });
    }

    // 2. Fetch real-time status from Cashfree
    const cfOrder = await getCashfreeOrder(orderId);
    
    // Cashfree v3 Order Statuses: 'PAID', 'ACTIVE', 'EXPIRED'
    if (cfOrder.order_status !== "PAID") {
      return NextResponse.json({ 
        status: transaction.status, 
        cf_status: cfOrder.order_status,
        message: "Order not paid yet" 
      });
    }

    // 3. IF PAID -> FULFILL (Idempotent logic similar to webhook)
    const prompt = (transaction as any).prompt;
    const creatorId = prompt.authorId;
    const buyerId = transaction.userId;
    const rawAmount = Number(cfOrder.order_amount);
    const cfPaymentId = "VERIFIED_VIA_API"; // Suffix to indicate manual verify

    const creatorShare = parseFloat((rawAmount * CREATOR_SHARE).toFixed(2));
    const platformFee  = parseFloat((rawAmount * PLATFORM_SHARE).toFixed(2));
    const releaseAt = new Date(Date.now() + RELEASE_DAYS * 24 * 60 * 60 * 1000);

    await prisma.$transaction(async (tx) => {
      // Mark transaction SUCCESS
      await tx.transaction.update({
        where: { id: transaction.id },
        data: { status: "SUCCESS", paymentId: cfPaymentId },
      });

      // Grant access
      await tx.purchase.upsert({
        where: { userId_promptId: { userId: buyerId, promptId: transaction.promptId } },
        update: {},
        create: { userId: buyerId, promptId: transaction.promptId },
      });

      // Wallet Updates
      const wallet = await (tx as any).wallet.upsert({
        where: { userId: creatorId },
        update: {
          pendingBalance: { increment: creatorShare },
          totalEarned:    { increment: creatorShare },
        },
        create: {
          userId: creatorId,
          pendingBalance:   creatorShare,
          availableBalance: 0,
          totalEarned:      creatorShare,
        },
      });

      await (tx as any).walletTransaction.create({
        data: {
          walletId:    wallet.id,
          userId:      creatorId,
          amount:      creatorShare,
          platformFee: 0,
          type:        "sale_credit",
          status:      "pending",
          source:      "sale",
          orderId,
          promptId:    transaction.promptId,
          releaseAt,
        },
      });

      // Platform Fee record
      await (tx as any).walletTransaction.create({
        data: {
          walletId:    wallet.id,
          userId:      creatorId,
          amount:      platformFee,
          platformFee: platformFee,
          type:        "platform_fee",
          status:      "available",
          source:      "sale",
          orderId:     `${orderId}_fee`,
          promptId:    transaction.promptId,
          releaseAt:   null,
        },
      });
    });

    return NextResponse.json({ status: "SUCCESS", message: "Purchase fulfilled manually" });

  } catch (error: any) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
  }
}
