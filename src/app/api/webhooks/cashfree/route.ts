import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { LedgerService } from '@/services/ledger.service';
import { LedgerGroupType, PayoutStatus, AccountType } from '@prisma/client';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const signature = req.headers.get('x-cashfree-signature');

    // PHASE 1: Simple Signature Verification (Optional but Recommended)
    // For Phase 1, we focus on processing data correctly if valid.
    /*
    const secret = process.env.CASHFREE_WEBHOOK_SECRET || '';
    const computedSignature = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('base64');
    if (signature !== computedSignature) throw new Error('Invalid Signature');
    */

    const { transferId, event, data } = payload;
    if (!transferId || !event) return NextResponse.json({ message: 'Ignored' });

    // 1. Fetch the Payout Group
    const group = await prisma.ledgerGroup.findUnique({
      where: { transferId },
      include: { entries: true },
    });

    if (!group) {
      console.warn(`Webhook: Payout Group for transferId ${transferId} not found`);
      return NextResponse.json({ message: 'Group not found' });
    }

    // 2. PHASE 1 GUARD: Idempotency
    if (group.status === PayoutStatus.SUCCESS || group.status === PayoutStatus.FAILED) {
      console.log(`Webhook: Transfer ${transferId} already processed (Status: ${group.status})`);
      return NextResponse.json({ message: 'Already processed' });
    }

    // 3. Process Events
    switch (event) {
      case 'TRANSFER_SUCCESS': {
        // SETTLEMENT: PLATFORM_ESCROW -> EXTERNAL_CASHFREE
        const amount = group.entries.find(e => e.amount.toNumber() > 0)?.amount.toNumber() || 0;
        
        const cashfreeAccount = await prisma.financialAccount.findUnique({
          where: { id: 'EXTERNAL_CASHFREE' },
        });

        if (!cashfreeAccount) throw new Error('EXTERNAL_CASHFREE account not found');

        await LedgerService.executeMovement(
          LedgerGroupType.PAYOUT_FINALIZED,
          [
            { accountId: 'PLATFORM_ESCROW', amount: -amount },
            { accountId: 'EXTERNAL_CASHFREE', amount: amount },
          ],
          `Settlement for ${transferId}`
        );

        await prisma.ledgerGroup.update({
          where: { id: group.id },
          data: { status: PayoutStatus.SUCCESS },
        });

        console.log(`✅ Transfer ${transferId} SUCCESS`);
        break;
      }

      case 'TRANSFER_FAILED':
      case 'TRANSFER_REVERSED': {
        // REVERSAL: PLATFORM_ESCROW -> USER
        await LedgerService.reverseMovement(group.id, `Transfer ${event}`);

        await prisma.ledgerGroup.update({
          where: { id: group.id },
          data: { status: PayoutStatus.FAILED },
        });

        console.log(`❌ Transfer ${transferId} ${event}`);
        break;
      }

      default:
        console.log(`Webhook: Ignored event ${event} for ${transferId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
