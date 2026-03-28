import { prisma } from '@/lib/db';
import { LedgerGroupType, Prisma } from '@prisma/client';

export type LedgerEntryInput = {
  accountId: string;
  amount: number | Prisma.Decimal;
};

export class LedgerService {
  /**
   * Executes a firm double-entry movement across accounts.
   * GUARANTEE: Zero-sum rule enforced at code level.
   */
  static async executeMovement(
    type: LedgerGroupType,
    entries: LedgerEntryInput[],
    description?: string,
    transferId?: string
  ) {
    // 1. Mandatory ZERO-SUM Guard
    const total = entries.reduce((sum, e) => sum + Number(e.amount), 0);
    
    // Using a tiny epsilon for floating point safety if amounts are numbers
    if (Math.abs(total) > 0.0001) {
      throw new Error(`Ledger Imbalance: Total movement sum must be exactly 0. Current sum: ${total}`);
    }

    return await prisma.$transaction(async (tx) => {
      // 2. Create the Ledger Group
      const group = await tx.ledgerGroup.create({
        data: {
          type,
          description,
          transferId,
          entries: {
            create: entries.map((e) => ({
              accountId: e.accountId,
              amount: new Prisma.Decimal(e.amount),
            })),
          },
        },
      });

      // 3. Atomically Update All Account Balances
      // NOTE: We do this sequentially in the transaction to maintain strict order
      for (const entry of entries) {
        await tx.financialAccount.update({
          where: { id: entry.accountId },
          data: {
            balance: {
              increment: new Prisma.Decimal(entry.amount),
            },
          },
        });
      }

      return group;
    });
  }

  /**
   * Reverses an existing movement by creating negated entries.
   * Ensures an append-only audit trail (no deletes).
   */
  static async reverseMovement(groupId: string, reason?: string) {
    const originalGroup = await prisma.ledgerGroup.findUnique({
      where: { id: groupId },
      include: { entries: true },
    });

    if (!originalGroup) throw new Error('Original Ledger Group not found');
    if (originalGroup.type === LedgerGroupType.REVERSAL) {
      throw new Error('Cannot reverse a reversal');
    }

    const reversalEntries: LedgerEntryInput[] = originalGroup.entries.map((e: any) => ({
      accountId: e.accountId,
      amount: new Prisma.Decimal(e.amount).negated(),
    }));

    return await this.executeMovement(
      LedgerGroupType.REVERSAL,
      reversalEntries,
      `Reversal of ${groupId}${reason ? ': ' + reason : ''}`
    );
  }
}
