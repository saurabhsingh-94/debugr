import { NextResponse } from "next/server";

/**
 * Minimal Cashfree Webhook Endpoint
 * Focus: Always respond with 200 OK during testing
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[Webhook] Received Cashfree Payload:", JSON.stringify(body, null, 2));

    // Always respond with 200 OK to signify receipt
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("[Webhook Error]:", err.message || err);
    
    // Even on error during testing, we return a valid JSON structure
    return NextResponse.json(
      { success: false, error: "Failed to parse payload" },
      { status: 500 }
    );
  }
}
