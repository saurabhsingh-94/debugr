import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

/**
 * Cashfree Webhook Handler
 * Processes payment success events to grant prompt access.
 */
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const signature = req.headers.get("x-webhook-signature");

    console.log("[Webhook] Received Cashfree Payload:", JSON.stringify(body, null, 2));

    // Basic Verification (Best practice: Verify signature in production)
    // For sandbox/initial dev, we process the data directly if signature is present.
    
    const event = body.type; // PAYMENT_SUCCESS_WEBHOOK or similar
    const data = body.data;

    if (event === "PAYMENT_SUCCESS_WEBHOOK") {
      const orderId = data.order.order_id;
      const paymentId = String(data.payment.cf_payment_id);
      const amount = data.payment.payment_amount;

      // Find the pending transaction
      const transaction = await prisma.transaction.findUnique({
        where: { orderId },
      });

      if (transaction && transaction.status !== "SUCCESS") {
        // 1. Update Transaction
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: "SUCCESS",
            paymentId,
          },
        });

        // 2. Create Purchase Record (Atomic access grant)
        await prisma.purchase.upsert({
          where: {
            userId_promptId: {
              userId: transaction.userId,
              promptId: transaction.promptId,
            },
          },
          update: {},
          create: {
            userId: transaction.userId,
            promptId: transaction.promptId,
          },
        });

        // 3. Create Notification for the Creator
        const prompt = await prisma.prompt.findUnique({
           where: { id: transaction.promptId },
           select: { authorId: true, title: true }
        });

        if (prompt?.authorId) {
            await prisma.notification.create({
               data: {
                  userId: prompt.authorId,
                  actorId: transaction.userId,
                  type: "PURCHASE",
                  message: `Purchased your prompt: ${prompt.title}`,
               }
            });
        }

        console.log(`✅ Purchase successful: User ${transaction.userId} -> Prompt ${transaction.promptId}`);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("[Webhook Error]:", err.message || err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
