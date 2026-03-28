import { PrismaClient, AccountType, LedgerGroupType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Phase 1 Financial Bootstrapping ---');

  // 1. Setup PLATFORM_ESCROW
  const escrowAccount = await prisma.financialAccount.upsert({
    where: { id: 'PLATFORM_ESCROW' },
    update: {},
    create: {
      id: 'PLATFORM_ESCROW',
      type: AccountType.PLATFORM_ESCROW,
      balance: 0,
    },
  });
  console.log('✅ PLATFORM_ESCROW initialized');

  // 2. Setup EXTERNAL_CASHFREE
  const cashfreeAccount = await prisma.financialAccount.upsert({
    where: { id: 'EXTERNAL_CASHFREE' },
    update: {},
    create: {
      id: 'EXTERNAL_CASHFREE',
      type: AccountType.EXTERNAL_CASHFREE,
      balance: 0,
    },
  });
  console.log('✅ EXTERNAL_CASHFREE initialized');

  // 3. Migrate Users to FinancialAccount
  const users = await prisma.user.findMany({
    include: { financialAccounts: true },
  });

  for (const user of users) {
    if (user.financialAccounts.length === 0) {
      await prisma.$transaction(async (tx) => {
        const account = await tx.financialAccount.create({
          data: {
            userId: user.id,
            type: AccountType.USER,
            balance: 0,
          },
        });

        // Create initial Ledger record (Zero-sum MIGRATION)
        await tx.ledgerGroup.create({
          data: {
            type: LedgerGroupType.MIGRATION,
            description: 'Phase 1 Initial Migration',
            entries: {
              create: [
                { accountId: account.id, amount: 0 },
              ],
            },
          },
        });
      });
      console.log(`✅ FinancialAccount created for user: ${user.id}`);
    }
  }

  console.log('--- Bootstrapping Complete ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
