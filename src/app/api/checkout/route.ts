import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { createCashfreeOrder } from "@/lib/cashfree";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { promptId } = await req.json();
    if (!promptId) {
      return NextResponse.json({ error: "promptId is required" }, { status: 400 });
    }

    // Strict config validation
    if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
      console.error("CRITICAL: Cashfree Credentials missing in environment.");
      return NextResponse.json({ error: "Checkout System Offline: Internal Config Error" }, { status: 500 });
    }

    // Smart URL detection
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    console.log("Using origin for checkout:", origin);

    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
    });

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    // Check if already purchased
    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        userId_promptId: {
          userId: session.user.id,
          promptId,
        },
      },
    });

    if (existingPurchase) {
      return NextResponse.json({ error: "Prompt already purchased" }, { status: 400 });
    }

    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Create pending transaction
    await prisma.transaction.create({
      data: {
        orderId,
        userId: session.user.id,
        promptId,
        amount: prompt.price,
        status: "PENDING",
      },
    });

    // Create Cashfree Order via Direct API Helper
    const cfRequest = {
      order_id: orderId,
      order_amount: prompt.price,
      order_currency: "INR",
      customer_details: {
        customer_id: session.user.id,
        customer_email: session.user.email || "no-email@debugr.platform",
        customer_phone: "9999999999", 
      },
      order_meta: {
        return_url: `${origin}/marketplace/status?order_id=${orderId}`,
        notify_url: `${origin}/api/webhooks/cashfree`,
      },
    };

    const response = await createCashfreeOrder(cfRequest);
    console.log("Generated orderId:", orderId);
    console.log("Cashfree response data:", response);
    
    return NextResponse.json({
      paymentSessionId: response.payment_session_id
    });
  } catch (err: any) {
    console.error("POST /api/checkout CRITICAL ERROR:", {
      message: err.message || err,
      stack: err.stack,
      hint: "Check Cashfree credentials and network status"
    });
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    }, { status: 500 });
  }
}
