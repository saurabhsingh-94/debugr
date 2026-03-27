import { prisma } from "@/lib/db";
import { cashfreePayout } from "@/lib/cashfree";
import { NextResponse } from "next/server";
import { format } from "date-fns";

export async function POST(req: Request) {
  // 1. Cron Security: Require CRON_SECRET header
  const authHeader = req.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    console.error("[Payouts] Unauthorized cron attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentMonth = format(new Date(), "yyyy-MM");
  console.log(`[Payouts] Starting monthly payout run for ${currentMonth}`);

  try {
    // 2. Fetch all Creators with PENDING earnings
    const creators = await prisma.user.findMany({
      where: {
        earnings: { some: { status: "PENDING" } },
      },
      include: {
        earnings: { where: { status: "PENDING" } },
      },
    });

    const results = [];

    for (const creator of creators) {
      const totalAmount = creator.earnings.reduce((sum, e) => sum + e.amount, 0);

      // 3. Skip if below threshold (₹100)
      if (totalAmount < 100) {
        console.log(`[Payouts] Skipping creator ${creator.id} (Amount ₹${totalAmount} < ₹100)`);
        continue;
      }

      // 4. Skip if Payout record already exists (Idempotency)
      const existingPayout = await prisma.payout.findUnique({
        where: {
          userId_month: {
            userId: creator.id,
            month: currentMonth,
          },
        },
      });

      if (existingPayout && existingPayout.status === "PAID") {
        console.log(`[Payouts] Skipping creator ${creator.id} (Already paid for ${currentMonth})`);
        continue;
      }

      // 5. Transfer Attempt
      try {
        if (!creator.cashfreeBeneficiaryId) {
           // Skip if no beneficiary ID set up (in real world, we'd trigger an email to notify them)
           console.error(`[Payouts] No beneficiary ID for creator ${creator.id}`);
           continue;
        }

        const transferId = `payout_${creator.id}_${currentMonth}`;

        // Create/Update Payout record to PROCESSING
        const payoutRecord = await prisma.payout.upsert({
          where: { userId_month: { userId: creator.id, month: currentMonth } },
          create: {
            userId: creator.id,
            amount: totalAmount,
            month: currentMonth,
            status: "PROCESSING",
          },
          update: { status: "PROCESSING" },
        });

        // Request Transfer via Cashfree API
        const transferResponse = await cashfreePayout.requestTransfer({
          beneId: creator.cashfreeBeneficiaryId,
          amount: totalAmount,
          transferId,
          transferMode: "banktransfer", // default
        });

        if (transferResponse.status === 200) {
          // 6. Finalize: Mark Earnings as PAID and Payout as PAID
          await prisma.$transaction([
            prisma.creatorEarning.updateMany({
              where: { userId: creator.id, status: "PENDING" },
              data: { status: "PAID" },
            }),
            prisma.payout.update({
              where: { id: payoutRecord.id },
              data: { status: "PAID" },
            }),
          ]);
          console.log(`[Payouts] Success: Sent ₹${totalAmount} to creator ${creator.id}`);
          results.push({ creatorId: creator.id, amount: totalAmount, status: "SUCCESS" });
        }
      } catch (err: any) {
        console.error(`[Payouts] Transfer FAILED for creator ${creator.id}:`, err.response?.data || err.message);
        await prisma.payout.update({
          where: { userId_month: { userId: creator.id, month: currentMonth } },
          data: { status: "FAILED" },
        });
        results.push({ creatorId: creator.id, amount: totalAmount, status: "FAILED", error: err.message });
      }
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error("[Payouts Run Error]:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
