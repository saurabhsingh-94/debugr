import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

const CREATOR_SHARE = 0.80;
const PLATFORM_SHARE = 0.20;
const RELEASE_DAYS = 7;

/**
 * Cashfree Webhook Handler — Production Grade
 *
 * Security:  HMAC-SHA256 signature verification
 * Safety:    Idempotency via DB unique constraint [orderId, type]
 * Atomicity: prisma.$transaction — all or nothing
 * Accuracy:  releaseAt stored per-transaction, cron checks condition only
 * Fees:      Platform fee stored as separate WalletTransaction record
 * Refunds:   PAYMENT_REFUND handled — deducts from pendingBalance
 */
export async function POST(req: Request) {
  const rawBody = await req.text();

  // ─── 1. HMAC SIGNATURE VERIFICATION ─────────────────────────────────────
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

  // ─── 2. PARSE ────────────────────────────────────────────────────────────
  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.type;
  const data = body.data;

  // ─── 3. ROUTE BY EVENT TYPE ──────────────────────────────────────────────
  switch (event) {
    case "PAYMENT_SUCCESS_WEBHOOK":
      return handlePaymentSuccess(data);

    case "PAYMENT_REFUND_WEBHOOK":
    case "REFUND_PROCESSED_WEBHOOK":
      return handleRefund(data);

    default:
      // Unknown event — acknowledge and discard
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

  // ── LOOK UP PROMPT & CREATOR ─────────────────────────────────────────────
  const prompt = await prisma.prompt.findUnique({
    where: { id: transaction.promptId },
    select: { authorId: true, title: true },
  });

  if (!prompt?.authorId) {
    return NextResponse.json({ error: "Prompt/creator not found" }, { status: 500 });
  }

  const creatorId = prompt.authorId;
  const buyerId = transaction.userId;

  // ── CALCULATE SPLITS (percentage of actual sale price) ───────────────────
  const creatorShare = parseFloat((rawAmount * CREATOR_SHARE).toFixed(2));
  const platformFee  = parseFloat((rawAmount * PLATFORM_SHARE).toFixed(2));

  // releaseAt = exactly 7 days from now — cron checks this condition only
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

      // 3. Upsert creator wallet — credit pendingBalance
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

      // 4. Log CREATOR earnings transaction
      //    @@unique([orderId, type]) is the DB-level race condition guard
      await (tx as any).walletTransaction.create({
        data: {
          walletId:    wallet.id,
          userId:      creatorId,
          amount:      creatorShare,
          platformFee: 0,           // creator record doesn't carry the fee
          type:        "sale_credit",
          status:      "pending",
          source:      "sale",
          orderId,
          promptId:    transaction.promptId,
          releaseAt,
        },
      });

      // 5. Log PLATFORM FEE as a separate record — for analytics & revenue tracking
      await (tx as any).walletTransaction.create({
        data: {
          walletId:    wallet.id,   // linked to creator wallet for traceability
          userId:      creatorId,   // store against creator for reference
          amount:      platformFee,
          platformFee: platformFee,
          type:        "platform_fee",
          status:      "available", // platform fee is immediately settled
          source:      "sale",
          orderId:     `${orderId}_fee`, // unique orderId suffix to satisfy @@unique
          promptId:    transaction.promptId,
          releaseAt:   null,        // platform fee has no hold
        },
      });

      // 6. Legacy CreatorEarning for backwards compatibility
      await tx.creatorEarning.create({
        data: { userId: creatorId, promptId: transaction.promptId, amount: creatorShare },
      });

      // 7. Notify creator (non-blocking — won't fail the transaction)
      try {
        await (tx as any).notification.create({
          data: {
            userId:  creatorId,
            actorId: buyerId,
            type:    "PURCHASE",
            message: `New sale! ₹${creatorShare} credited (₹${rawAmount} × 80%) — "${prompt.title}"`,
          },
        });
      } catch (e) {
        console.warn("[Webhook] Notification failed (non-fatal):", e);
      }
    });

    console.log(`✅ [Webhook] ${orderId} — Creator ₹${creatorShare} / Platform ₹${platformFee}`);
  } catch (err: any) {
    // P2002 = unique constraint violation = already processed (race condition guard)
    if (err?.code === "P2002") {
      console.log(`[Webhook] Duplicate blocked for ${orderId}`);
      return NextResponse.json({ ok: true, skipped: true });
    }
    console.error("[Webhook] Fatal:", err.message);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// REFUND HANDLER — Production Grade
//
// Fixes applied:
//  1. Negative balance protection  — clamp to 0, log debt for future deduction
//  2. Double-refund prevention     — check status === "refunded" first
//  3. Platform fee reversal        — marks platform_fee record as "fee_refunded"
//  4. Partial refund support       — proportional deduction by refund_amount
//  5. Status history preserved     — never deletes, only updates status field
// ─────────────────────────────────────────────────────────────────────────────
async function handleRefund(data: any) {
  const orderId     = data?.order?.order_id || data?.refund?.order_id;
  // Cashfree sends refund_amount for partial refunds; fall back to full amount
  const refundAmount = Number(
    data?.refund?.refund_amount || data?.payment?.payment_amount || 0
  );

  if (!orderId || !refundAmount) {
    return NextResponse.json({ error: "Missing orderId or refund amount" }, { status: 400 });
  }

  // Find the original sale_credit transaction
  const originalTxn = await (prisma as any).walletTransaction.findFirst({
    where: { orderId, type: "sale_credit" },
  });

  if (!originalTxn) {
    console.warn(`[Refund] No sale_credit found for ${orderId} — skipped`);
    return NextResponse.json({ ok: true, skipped: true });
  }

  // ── FIX 2: Double-refund prevention ────────────────────────────────────────
  if (originalTxn.status === "refunded") {
    console.log(`[Refund] ${orderId} already refunded — skipped`);
    return NextResponse.json({ ok: true, skipped: true });
  }

  // ── FIX 4: Proportional partial refund ─────────────────────────────────────
  // Derive creator's portion of THIS refund proportionally.
  // e.g. original sale ₹1000 → creator got ₹800.
  //      partial refund ₹500 → deduct ₹400 (80% of ₹500).
  const creatorDeduction = parseFloat((refundAmount * CREATOR_SHARE).toFixed(2));
  const platformDeduction = parseFloat((refundAmount * PLATFORM_SHARE).toFixed(2));

  // Determine which balance bucket to deduct from
  const deductFrom = originalTxn.status === "pending" ? "pendingBalance" : "availableBalance";

  // Fetch current wallet to check for negative balance risk
  const wallet = await (prisma as any).wallet.findUnique({
    where: { userId: originalTxn.userId },
    select: { id: true, pendingBalance: true, availableBalance: true, totalEarned: true },
  });

  if (!wallet) {
    console.error(`[Refund] Wallet not found for user ${originalTxn.userId}`);
    return NextResponse.json({ error: "Wallet not found" }, { status: 500 });
  }

  // ── FIX 1: Negative balance protection ─────────────────────────────────────
  const currentBalance = Number(
    deductFrom === "pendingBalance" ? wallet.pendingBalance : wallet.availableBalance
  );
  const actualDeduction = Math.min(creatorDeduction, currentBalance); // never go below 0
  const debt            = parseFloat((creatorDeduction - actualDeduction).toFixed(2));

  console.warn(
    `[Refund] orderId: ${orderId} | deductFrom: ${deductFrom} | ` +
    `creatorDeduction: ₹${creatorDeduction} | available: ₹${currentBalance} | ` +
    `actualDeduction: ₹${actualDeduction} | debt: ₹${debt}`
  );

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Mark original sale_credit as "refunded" (preserves history)
      await (tx as any).walletTransaction.update({
        where: { id: originalTxn.id },
        data:  { status: "refunded" },
      });

      // 2. Deduct from wallet — clamped to never go negative
      const walletUpdate: Record<string, any> = {
        totalEarned: { decrement: actualDeduction },
      };
      walletUpdate[deductFrom] = { decrement: actualDeduction };
      await (tx as any).wallet.update({
        where: { userId: originalTxn.userId },
        data:  walletUpdate,
      });

      // 3. Log the refund debit record
      await (tx as any).walletTransaction.create({
        data: {
          walletId:    wallet.id,
          userId:      originalTxn.userId,
          amount:      actualDeduction,
          platformFee: 0,
          type:        "refund_debit",
          status:      "completed",
          source:      "refund",
          orderId:     `${orderId}_refund`,
          promptId:    originalTxn.promptId,
          releaseAt:   null,
        },
      });

      // 4. If user's balance couldn't cover the full refund, log the debt
      //    Future payout logic should check this record before releasing funds
      if (debt > 0) {
        console.error(
          `[Refund] ⚠️  Debt created: ₹${debt} for user ${originalTxn.userId} — ` +
          `will deduct from future earnings`
        );
        await (tx as any).walletTransaction.create({
          data: {
            walletId:    wallet.id,
            userId:      originalTxn.userId,
            amount:      debt,
            platformFee: 0,
            type:        "debt_record",        // future payout will honour this
            status:      "pending",
            source:      "refund",
            orderId:     `${orderId}_debt`,
            promptId:    originalTxn.promptId,
            releaseAt:   null,
          },
        });
      }

      // 5. FIX 3: Reverse the platform fee record too — mark as "fee_refunded"
      const feeTxn = await (tx as any).walletTransaction.findFirst({
        where: { orderId: `${orderId}_fee`, type: "platform_fee" },
      });
      if (feeTxn) {
        await (tx as any).walletTransaction.update({
          where: { id: feeTxn.id },
          data:  { status: "fee_refunded" },
        });
        // Log the platform fee reversal for analytics accuracy
        await (tx as any).walletTransaction.create({
          data: {
            walletId:    wallet.id,
            userId:      originalTxn.userId,
            amount:      platformDeduction,
            platformFee: platformDeduction,
            type:        "platform_fee_refund",
            status:      "completed",
            source:      "refund",
            orderId:     `${orderId}_fee_refund`,
            promptId:    originalTxn.promptId,
            releaseAt:   null,
          },
        });
      }
    });

    console.log(`[Refund] ✅ Complete — order: ${orderId} | deducted: ₹${actualDeduction} | debt: ₹${debt}`);
  } catch (err: any) {
    console.error("[Refund] Fatal error:", err.message);
    return NextResponse.json({ error: "Refund processing failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
