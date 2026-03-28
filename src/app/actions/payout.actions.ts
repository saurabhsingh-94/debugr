'use server';

import { prisma } from '@/lib/db';
import { LedgerService } from '@/services/ledger.service';
import { LedgerGroupType, PayoutStatus, AccountType } from '@prisma/client';
import { cashfreePayout } from '@/lib/cashfree';
import { auth } from '@/auth';

/**
 * PHASE 1: User Request Payout
 * Moves funds from USER -> PLATFORM_ESCROW
 * Sets initial status to PENDING
 */
export async function requestPayout(amount: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const userId = session.user.id;

  // 1. Fetch User Financial Account
  const account = await prisma.financialAccount.findFirst({
    where: { userId, type: AccountType.USER },
  });

  if (!account) throw new Error('Financial account not found');
  if (account.isFrozen) throw new Error('Account is frozen');
  if (account.balance.toNumber() < amount) throw new Error('Insufficient balance');

  // 2. Fetch PLATFORM_ESCROW Account
  const escrowAccount = await prisma.financialAccount.findUnique({
    where: { id: 'PLATFORM_ESCROW' },
  });

  if (!escrowAccount) throw new Error('System Error: Escrow account not found');

  // 3. Execute Ledger Movement (USER -> ESCROW)
  // ZERO-SUM enforced inside LedgerService
  const group = await LedgerService.executeMovement(
    LedgerGroupType.PAYOUT_REQUEST,
    [
      { accountId: account.id, amount: -amount },
      { accountId: escrowAccount.id, amount: amount },
    ],
    `Payout Request: ${amount}`,
    undefined // transferId not generated yet
  );

  // 4. Set Payout Status to PENDING
  await prisma.ledgerGroup.update({
    where: { id: group.id },
    data: { status: PayoutStatus.PENDING },
  });

  return { success: true, groupId: group.id };
}

/**
 * PHASE 1: Admin Approve Payout
 * Strict Order:
 * 1. Lock DB (status = PROCESSING + transferId)
 * 2. THEN Call Cashfree API
 */
export async function approvePayout(groupId: string) {
  const session = await auth();
  const isAdmin = session?.user?.role === 'SUPER_ADMIN' || session?.user?.role === 'FINANCE_ADMIN';
  if (!isAdmin) throw new Error('Unauthorized: Admin access required');

  // 1. Fetch Group & Guard Status
  const group = await prisma.ledgerGroup.findUnique({
    where: { id: groupId },
    include: { entries: true, account: true }, // wait, account relation?? - No, entries lead to accounts
  });

  if (!group || group.type !== LedgerGroupType.PAYOUT_REQUEST) {
    throw new Error('Invalid Payout Request');
  }

  if (group.status !== PayoutStatus.PENDING) {
    throw new Error(`Invalid Status: Payout is already ${group.status}`);
  }

  // 2. Generate Transfer ID for Idempotency
  const transferId = `trf_${group.id}`;

  // 3. LOCK BEFORE API: Update Status to PROCESSING
  await prisma.ledgerGroup.update({
    where: { id: group.id },
    data: { 
      status: PayoutStatus.PROCESSING,
      transferId 
    },
  });

  // 4. CALL CASHFREE API
  try {
    const userEntry = group.entries.find(e => e.amount.toNumber() < 0);
    const userAccount = await prisma.financialAccount.findUnique({
      where: { id: userEntry?.accountId },
    });
    
    // We expect cashfreeBeneficiaryId on the User record linked to this financial account
    const user = await prisma.user.findUnique({
      where: { id: userAccount?.userId || '' },
    });

    if (!user?.cashfreeBeneficiaryId) {
      throw new Error('User has no beneficiary ID configured');
    }

    const amount = Math.abs(userEntry?.amount.toNumber() || 0);

    const response = await cashfreePayout.requestTransfer({
      transferId,
      amount,
      beneId: user.cashfreeBeneficiaryId,
    });

    if (response.status === 'ERROR') {
      throw new Error(response.message || 'Cashfree API Error');
    }

    return { success: true, message: 'Payout processing started', cfResponse: response };
  } catch (error) {
    // If API fails BEFORE generating a success/fail response, we might need a retry mechanism.
    // For Phase 1, we manually handle or wait for webhook to fix.
    console.error('Payout Approval Error:', error);
    throw error;
  }
}

/**
 * PHASE 1: Admin Reject Payout
 * 1. Trigger Reversal (Escrow -> USER)
 * 2. Set Status to REJECTED
 */
export async function rejectPayout(groupId: string) {
  const session = await auth();
  const isAdmin = session?.user?.role === 'SUPER_ADMIN' || session?.user?.role === 'FINANCE_ADMIN';
  if (!isAdmin) throw new Error('Unauthorized: Admin access required');

  const group = await prisma.ledgerGroup.findUnique({
    where: { id: groupId },
  });

  if (!group || group.status !== PayoutStatus.PENDING) {
    throw new Error('Only PENDING payouts can be rejected');
  }

  // 1. Reverse the Movement (ESCROW -> USER)
  await LedgerService.reverseMovement(groupId, 'Admin Rejection');

  // 2. Clear status from original group or set to REJECTED
  await prisma.ledgerGroup.update({
    where: { id: groupId },
    data: { status: PayoutStatus.REJECTED },
  });

  return { success: true, message: 'Payout rejected and funds returned to user' };
}
