import { LedgerService } from '../src/services/ledger.service';
import { prisma } from '../src/lib/db';
import { LedgerGroupType, AccountType } from '@prisma/client';

async function testLedger() {
  console.log('--- Phase 1 Ledger Validation ---');

  // 1. Setup Test User Account
  const testUser = await prisma.user.upsert({
    where: { email: 'test_ledger@example.com' },
    update: {},
    create: { email: 'test_ledger@example.com', name: 'Test Ledger User' },
  });

  const userAccount = await prisma.financialAccount.upsert({
    where: { id: `acc_${testUser.id}` },
    update: { balance: 100 },
    create: {
      id: `acc_${testUser.id}`,
      userId: testUser.id,
      type: AccountType.USER,
      balance: 100,
    },
  });

  const escrowAccount = await prisma.financialAccount.findUnique({ where: { id: 'PLATFORM_ESCROW' } });
  if (!escrowAccount) throw new Error('PLATFORM_ESCROW not initialized');

  console.log('✅ Accounts ready');

  // 2. Test Balanced Movement (₹10 move USER -> ESCROW)
  try {
    const group = await LedgerService.executeMovement(
      LedgerGroupType.PAYOUT_REQUEST,
      [
        { accountId: userAccount.id, amount: -10 },
        { accountId: escrowAccount.id, amount: 10 },
      ],
      'Test Balanced Movement'
    );
    console.log('✅ Balanced movement success - Group ID:', group.id);
  } catch (e) {
    console.error('❌ Balanced movement FAILED:', e);
  }

  // 3. Test Imbalanced Movement (₹10 move USER only, NO counterpart)
  try {
    await LedgerService.executeMovement(
      LedgerGroupType.PAYOUT_REQUEST,
      [{ accountId: userAccount.id, amount: -10 }],
      'Test Imbalanced Movement'
    );
    console.error('❌ Imbalanced movement logic FAILED (Should have thrown error)');
  } catch (e) {
    console.log('✅ Imbalanced movement caught correctly (Zero-Sum Guard):', (e as Error).message);
  }

  // 4. Test Reversal
  try {
    const groupToReverse = await LedgerService.executeMovement(
      LedgerGroupType.PAYOUT_REQUEST,
      [
        { accountId: userAccount.id, amount: -50 },
        { accountId: escrowAccount.id, amount: 50 },
      ],
      'Reversal Target'
    );
    const reversalGroup = await LedgerService.reverseMovement(groupToReverse.id, 'Test Reversal');
    console.log('✅ Reversal success - Reversal Group ID:', reversalGroup.id);
  } catch (e) {
    console.error('❌ Reversal FAILED:', e);
  }

  console.log('--- Validation Complete ---');
}

testLedger()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
