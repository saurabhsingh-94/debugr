import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { Decimal } from "@prisma/client/runtime/library";

const CREATOR_SHARE = 0.80;
const PLATFORM_SHARE = 0.20;
const RELEASE_DAYS = 7;

/**
 * Cashfree Webhook Handler — Production Grade
 * - HMAC-SHA256 signature verification
 * - Idempotency protection via unique constraint
 * - Atomic DB transaction (purchase + wallet credit in one shot)
 * - 7-day pending release on creator earnings
 */
export async function POST(req: Request) {
  const rawBody = await req.text();

  // ─── 1. SIGNATURE VERIFICATION ───────────────────────────────────────────
  const timestamp = req.headers.get("x-webhook-timestamp") || "";
  const receivedSig = req.headers.get("x-webhook-signature") || "";
  const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET || process.env.CASHFREE_SECRET_KEY || "";

  if (webhookSecret) {
    const computedSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(timestamp + rawBody)
      .digest("base64");

    if (computedSig !== receivedSig) {
      console.warn("[Webhook] ⚠️  Invalid signature — rejected");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  // ─── 2. PARSE EVENT ──────────────────────────────────────────────────────
  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.type;
  const data = body.data;

  if (event !== "PAYMENT_SUCCESS_WEBHOOK") {
    // Not a payment event — acknowledge and move on
    return NextResponse.json({ ok: true, skipped: true });
  }

  const orderId = data?.order?.order_id;
  const cfPaymentId = String(data?.payment?.cf_payment_id);
  const rawAmount = Number(data?.payment?.payment_amount || 0);

  if (!orderId || !rawAmount) {
    return NextResponse.json({ error: "Missing orderId or amount" }, { status: 400 });
  }

  // ─── 3. IDEMPOTENCY CHECK ─────────────────────────────────────────────────
  const transaction = await prisma.transaction.findUnique({ where: { orderId } });

  if (!transaction) {
    console.warn(`[Webhook] No matching transaction for orderId: ${orderId}`);
    return NextResponse.json({ ok: true, skipped: true });
  }

  if (transaction.status === "SUCCESS") {
    console.log(`[Webhook] Order ${orderId} already processed — skipping`);
    return NextResponse.json({ ok: true, skipped: true });
  }

  // ─── 4. LOOK UP PROMPT & CREATOR ─────────────────────────────────────────
  const prompt = await prisma.prompt.findUnique({
    where: { id: transaction.promptId },
    select: { authorId: true, title: true },
  });

  if (!prompt?.authorId) {
    console.error(`[Webhook] Prompt ${transaction.promptId} not found or has no author`);
    return NextResponse.json({ error: "Prompt not found" }, { status: 500 });
  }

  const creatorId = prompt.authorId;
  const buyerId = transaction.userId;
  const creatorShare = parseFloat((rawAmount * CREATOR_SHARE).toFixed(2));
  const platformFee = parseFloat((rawAmount * PLATFORM_SHARE).toFixed(2));
  const releaseAt = new Date(Date.now() + RELEASE_DAYS * 24 * 60 * 60 * 1000);

  // ─── 5. ATOMIC DB TRANSACTION ─────────────────────────────────────────────
  try {
    await prisma.$transaction(async (tx) => {
      // a. Mark the order as paid
      await tx.transaction.update({
        where: { id: transaction.id },
        data: { status: "SUCCESS", paymentId: cfPaymentId },
      });

      // b. Grant buyer access (idempotent upsert)
      await tx.purchase.upsert({
        where: { userId_promptId: { userId: buyerId, promptId: transaction.promptId } },
        update: {},
        create: { userId: buyerId, promptId: transaction.promptId },
      });

      // c. Upsert creator's wallet and credit pending balance
      const wallet = await (tx as any).wallet.upsert({
        where: { userId: creatorId },
        update: {
          pendingBalance: { increment: creatorShare },
          totalEarned: { increment: creatorShare },
        },
        create: {
          userId: creatorId,
          pendingBalance: creatorShare,
          availableBalance: 0,
          totalEarned: creatorShare,
        },
      });

      // d. Log wallet transaction (unique on orderId + type prevents double credit)
      await (tx as any).walletTransaction.create({
        data: {
          walletId: wallet.id,
          userId: creatorId,
          amount: creatorShare,
          platformFee: platformFee,
          type: "sale_credit",
          status: "pending",
          source: "sale",
          orderId,
          promptId: transaction.promptId,
          releaseAt,
        },
      });

      // e. Also credit to legacy CreatorEarning for backward compat
      await tx.creatorEarning.create({
        data: { userId: creatorId, promptId: transaction.promptId, amount: creatorShare },
      });

      // f. Notify creator (non-blocking)
      try {
        await (tx as any).notification.create({
          data: {
            userId: creatorId,
            actorId: buyerId,
            type: "PURCHASE",
            message: `Someone purchased your prompt: "${prompt.title}" — ₹${creatorShare} credited`,
          },
        });
      } catch (notifErr) {
        console.warn("[Webhook] Notification failed (non-fatal):", notifErr);
      }
    });

    console.log(`✅ [Webhook] Order ${orderId} processed — Creator ${creatorId} credited ₹${creatorShare}`);
  } catch (err: any) {
    // Unique constraint violation means already processed (race condition guard)
    if (err?.code === "P2002") {
      console.log(`[Webhook] Duplicate wallet transaction for ${orderId} — skipped (race condition guard)`);
      return NextResponse.json({ ok: true, skipped: true });
    }
    console.error("[Webhook] Fatal error:", err.message);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
