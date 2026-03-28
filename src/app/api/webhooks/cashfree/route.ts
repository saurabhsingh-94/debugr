import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { sendPurchaseConfirmation, sendSaleNotification } from "@/lib/resend";
import { LedgerService } from "@/services/ledger.service";

const CREATOR_SHARE = 0.80;
const PLATFORM_SHARE = 0.20;

/**
 * Cashfree Webhook Handler — Enterprise-Grade Correctness
 */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const timestamp = req.headers.get("x-webhook-timestamp") || "";
  const receivedSig = req.headers.get("x-webhook-signature") || "";
  const eventId = req.headers.get("x-webhook-id") || `evt_${Date.now()}`;

  const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET || process.env.CASHFREE_SECRET_KEY || "";

  // 1. SIGNATURE VERIFICATION
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

  // 2. IDEMPOTENCY GUARD & INBOUND LOG
  const existing = await (prisma as any).inboundWebhook.findUnique({ where: { eventId } });
  if (existing && existing.status === "PROCESSED") {
    return NextResponse.json({ ok: true, message: "Already processed" });
  }

  const webhookRecord = await (prisma as any).inboundWebhook.upsert({
    where: { eventId },
    update: { attempts: { increment: 1 } },
    create: { eventId, provider: "cashfree", payload: JSON.parse(rawBody), status: "RECEIVED" },
  });

  try {
    const body = JSON.parse(rawBody);
    const event = body.type;
    const data = body.data;

    let response: any;
    switch (event) {
      case "PAYMENT_SUCCESS_WEBHOOK":
        response = await handlePaymentSuccess(data, webhookRecord.id);
        break;
      case "PAYMENT_REFUND_WEBHOOK":
      case "REFUND_PROCESSED_WEBHOOK":
        response = await handleRefund(data, webhookRecord.id);
        break;
      default:
        response = NextResponse.json({ ok: true, skipped: true });
    }

    await (prisma as any).inboundWebhook.update({
      where: { id: webhookRecord.id },
      data: { status: "PROCESSED" },
    });

    return response;
  } catch (err: any) {
    console.error(`[Webhook] Fatal Error on Event ${eventId}:`, err.message);
    const isFatal = webhookRecord.attempts >= 3;
    await (prisma as any).inboundWebhook.update({
      where: { id: webhookRecord.id },
      data: { 
        status: isFatal ? "DEAD_LETTER" : "FAILED", 
        errorMessage: err.message,
        lastAttemptAt: new Date()
      },
    });
    return NextResponse.json({ error: "Self-healing in progress" }, { status: 500 });
  }
}

async function handlePaymentSuccess(data: any, webhookId: string) {
  const orderId     = data?.order?.order_id;
  const cfPaymentId = String(data?.payment?.cf_payment_id || "");
  const amount      = Number(data?.payment?.payment_amount || 0);

  if (!orderId || !amount) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const transaction = await prisma.transaction.findUnique({ where: { orderId } });
  if (!transaction || transaction.status === "SUCCESS") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const prompt = await prisma.prompt.findUnique({
    where: { id: transaction.promptId },
    include: { author: { select: { id: true, email: true } } }
  });

  const buyer = await prisma.user.findUnique({
    where: { id: transaction.userId },
    select: { email: true }
  });

  if (!prompt || !buyer) return NextResponse.json({ error: "Context not found" }, { status: 500 });

  const creatorWallet = await (prisma as any).wallet.findUnique({ where: { userId: prompt.authorId } });
  const PLATFORM_WALLET_ID = "platform_revenue_account_v1";

  const creatorShare = parseFloat((amount * CREATOR_SHARE).toFixed(2));
  const platformFee  = parseFloat((amount * PLATFORM_SHARE).toFixed(2));

  // 3. EXECUTE DOUBLE-ENTRY MOVEMENT
  await LedgerService.executeMovement({
    type: "SALE",
    description: `Sale of Prompt ${transaction.promptId} (Order: ${orderId})`,
    metadata: { webhookId, orderId, cfPaymentId },
    entries: [
      { 
        walletId: "external_cashfree",   
        amount: -amount,  
        bucket: "availableBalance", 
        description: "External Collection" 
      },
      { 
        walletId: creatorWallet.id,      
        amount: creatorShare, 
        bucket: "availableBalance", 
        description: "Creator Credit" 
      },
      { 
        walletId: PLATFORM_WALLET_ID,    
        amount: platformFee,  
        bucket: "availableBalance", 
        description: "Platform Fee Revenue" 
      },
    ]
  });

  await prisma.transaction.update({
    where: { id: transaction.id },
    data: { status: "SUCCESS", paymentId: cfPaymentId },
  });

  await Promise.allSettled([
    sendPurchaseConfirmation({ 
      to: buyer.email!, 
      promptTitle: prompt.title, 
      orderId, 
      amount, 
      currency: "INR" 
    }),
    sendSaleNotification({ 
      to: prompt.author.email!, 
      promptTitle: prompt.title, 
      amount: creatorShare, 
      currency: "INR" 
    })
  ]);

  revalidatePath("/marketplace");
  revalidatePath("/dashboard");

  return NextResponse.json({ ok: true });
}

async function handleRefund(data: any, webhookId: string) {
  // Logic to reverse ledger entries
  return NextResponse.json({ ok: true, message: "Refund processing not implemented yet" });
}
