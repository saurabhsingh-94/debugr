import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { cashfree } from "@/lib/cashfree";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

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

    const orderId = `order_${uuidv4()}`;

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

    // Create Cashfree Order
    const cfRequest = {
      order_id: orderId,
      order_amount: prompt.price,
      order_currency: "INR",
      customer_details: {
        customer_id: session.user.id,
        customer_email: session.user.email || "no-email@debugr.platform",
        customer_phone: "9999999999", // Mock or from user profile
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/marketplace/status?order_id=${orderId}`,
        notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/cashfree`,
      },
    };

    const response = await cashfree.PGCreateOrder("2023-08-01", cfRequest);
    
    return NextResponse.json({
      paymentSessionId: response.data.payment_session_id,
      orderId: orderId,
    });
  } catch (err: any) {
    console.error("POST /api/checkout error:", err.response?.data || err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
