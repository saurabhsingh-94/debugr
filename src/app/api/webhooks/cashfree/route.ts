import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { sendPurchaseConfirmation, sendSaleNotification } from "@/lib/resend";

const CREATOR_SHARE = 0.80;
const PLATFORM_SHARE = 0.20;
const RELEASE_DAYS = 7;

/**
 * Cashfree Webhook Handler — Production Grade
 */
export async function POST(req: Request) {
  const rawBody = await req.text();

  // 1. HMAC SIGNATURE VERIFICATION
  const timestamp = req.headers.get("x-webhook-timestamp") || "";
  const receivedSig = req.headers.get("x-webhook-signature") || "";
  const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET || process.env.CASHFREE_SECRET_KEY || "";

  if (webhookSecret && receivedSig) {
    const computedSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(timestamp + rawBody)
      .digest("base64");

    if (computedSig !== receivedSig) {
      console.warn("[Webhook] ⚠️  Invalid signature — rejected");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  // 2. PARSE
  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.type;
  const data = body.data;

  // 3. ROUTE BY EVENT TYPE
  switch (event) {
    case "PAYMENT_SUCCESS_WEBHOOK":
      return handlePaymentSuccess(data);

    case "PAYMENT_REFUND_WEBHOOK":
    case "REFUND_PROCESSED_WEBHOOK":
      return handleRefund(data);

    default:
      return NextResponse.json({ ok: true, skipped: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT SUCCESS
// ─────────────────────────────────────────────────────────────────────────────
async function handlePaymentSuccess(data: any) {
  const orderId = data?.order?.order_id;
  const cfPaymentId = String(data?.payment?.cf_payment_id || "");
  const rawAmount = Number(data?.payment?.payment_amount || 0);

  if (!orderId || !rawAmount) {
    return NextResponse.json({ error: "Missing orderId or amount" }, { status: 400 });
  }

  // ── IDEMPOTENCY CHECK ────────────────────────────────────────────────────
  const transaction = await prisma.transaction.findUnique({ where: { orderId } });

  if (!transaction) {
    console.warn(`[Webhook] No transaction for orderId: ${orderId}`);
    return NextResponse.json({ ok: true, skipped: true });
  }
  if (transaction.status === "SUCCESS") {
    console.log(`[Webhook] ${orderId} already processed — skipped`);
    return NextResponse.json({ ok: true, skipped: true });
  }

  // ── LOOK UP PROMPT & CREATOR & BUYER ─────────────────────────────────────
  const prompt = await prisma.prompt.findUnique({
    where: { id: transaction.promptId },
    select: { 
      authorId: true, 
      title: true, 
      author: { select: { id: true, email: true } } 
    },
  });

  const buyer = await prisma.user.findUnique({
    where: { id: transaction.userId },
    select: { email: true }
  });

  if (!prompt?.authorId || !buyer?.email) {
    return NextResponse.json({ error: "Context for notifications not found" }, { status: 500 });
  }

  const creatorEmail = prompt.author.email || "";
  const buyerEmail = buyer.email;
  const creatorId = prompt.authorId;
  const buyerId = transaction.userId;

  // ── CALCULATE SPLITS ─────────────────────────────────────────────────────
  const creatorShare = parseFloat((rawAmount * CREATOR_SHARE).toFixed(2));
  const platformFee  = parseFloat((rawAmount * PLATFORM_SHARE).toFixed(2));
  const releaseAt = new Date(Date.now() + RELEASE_DAYS * 24 * 60 * 60 * 1000);

  // ── ATOMIC TRANSACTION ───────────────────────────────────────────────────
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Mark order paid
      await tx.transaction.update({
        where: { id: transaction.id },
        data: { status: "SUCCESS", paymentId: cfPaymentId },
      });

      // 2. Grant buyer access (idempotent)
      await tx.purchase.upsert({
        where: { userId_promptId: { userId: buyerId, promptId: transaction.promptId } },
        update: {},
        create: { userId: buyerId, promptId: transaction.promptId },
      });

      // 3. Upsert creator wallet
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

      // 4. Log transactions
      await (tx as any).walletTransaction.create({
        data: {
          walletId:    wallet.id,
          userId:      creatorId,
          amount:      creatorShare,
          type:        "sale_credit",
          status:      "pending",
          source:      "sale",
          orderId,
          promptId:    transaction.promptId,
          releaseAt,
        },
      });

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
        },
      });

      // 5. Legacy CreatorEarning
      await tx.creatorEarning.create({
        data: { userId: creatorId, promptId: transaction.promptId, amount: creatorShare },
      });

      // 6. Notify creator in-app
      try {
        await (tx as any).notification.create({
          data: {
            userId:  creatorId,
            actorId: buyerId,
            type:    "PURCHASE",
            message: `New sale! ₹${creatorShare} credited — "${prompt.title}"`,
          },
        });
      } catch (e) {
        console.warn("[Webhook] Notification failed (non-fatal):", e);
      }
    });

    // ── SEND EMAILS ────────────────────────────────────────────────────────
    await Promise.allSettled([
        sendPurchaseConfirmation(buyerEmail, prompt.title, orderId, rawAmount),
        sendSaleNotification(creatorEmail, prompt.title, creatorShare)
    ]);

    revalidatePath("/marketplace");
    revalidatePath("/dashboard");

    console.log(`✅ [Webhook] ${orderId} synced and notified`);
  } catch (err: any) {
    if (err?.code === "P2002") return NextResponse.json({ ok: true, skipped: true });
    console.error("[Webhook] Fatal:", err.message);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// REFUND HANDLER — PRODUCTION GRADE
// ─────────────────────────────────────────────────────────────────────────────
async function handleRefund(data: any) {
  const orderId = data?.order?.order_id || data?.refund?.order_id;
  const refundAmount = Number(data?.refund?.refund_amount || data?.payment?.payment_amount || 0);

  if (!orderId || !refundAmount) {
    return NextResponse.json({ error: "Missing orderId or refund amount" }, { status: 400 });
  }

  const originalTxn = await (prisma as any).walletTransaction.findFirst({
    where: { orderId, type: "sale_credit" },
  });

  if (!originalTxn || originalTxn.status === "refunded") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const creatorDeduction = parseFloat((refundAmount * CREATOR_SHARE).toFixed(2));
  const platformDeduction = parseFloat((refundAmount * PLATFORM_SHARE).toFixed(2));
  const deductFrom = originalTxn.status === "pending" ? "pendingBalance" : "availableBalance";

  const wallet = await (prisma as any).wallet.findUnique({
    where: { userId: originalTxn.userId },
    select: { id: true, pendingBalance: true, availableBalance: true, totalEarned: true },
  });

  if (!wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 500 });

  const currentBalance = Number(deductFrom === "pendingBalance" ? wallet.pendingBalance : wallet.availableBalance);
  const actualDeduction = Math.min(creatorDeduction, currentBalance);
  const debt = parseFloat((creatorDeduction - actualDeduction).toFixed(2));

  try {
    await prisma.$transaction(async (tx) => {
      await (tx as any).walletTransaction.update({
        where: { id: originalTxn.id },
        data:  { status: "refunded" },
      });

      const walletUpdate: any = { totalEarned: { decrement: actualDeduction } };
      walletUpdate[deductFrom] = { decrement: actualDeduction };
      
      await (tx as any).wallet.update({
        where: { userId: originalTxn.userId },
        data: walletUpdate,
      });

      await (tx as any).walletTransaction.create({
        data: {
          walletId: wallet.id,
          userId: originalTxn.userId,
          amount: actualDeduction,
          type: "refund_debit",
          status: "completed",
          source: "refund",
          orderId: `${orderId}_refund`,
          promptId: originalTxn.promptId,
        },
      });

      if (debt > 0) {
        await (tx as any).walletTransaction.create({
          data: {
            walletId: wallet.id,
            userId: originalTxn.userId,
            amount: debt,
            type: "debt_record",
            status: "pending",
            source: "refund",
            orderId: `${orderId}_debt`,
            promptId: originalTxn.promptId,
          },
        });
      }

      const feeTxn = await (tx as any).walletTransaction.findFirst({
        where: { orderId: `${orderId}_fee`, type: "platform_fee" },
      });
      if (feeTxn) {
        await (tx as any).walletTransaction.update({
          where: { id: feeTxn.id },
          data: { status: "fee_refunded" },
        });
      }
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[Refund] Fatal:", err.message);
    return NextResponse.json({ error: "Refund failed" }, { status: 500 });
  }
}
