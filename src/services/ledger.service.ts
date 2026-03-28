import { prisma } from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";

export interface LedgerEntryInput {
  walletId: string;
  amount: number | Decimal; // Negative for Debit, Positive for Credit
  bucket: "availableBalance" | "pendingBalance";
  description: string;
}

export class LedgerService {
  /**
   * Final Enterprise Ledger Engine
   * Ensures SUM(amount) === 0 across all entries in the LedgerGroup.
   */
  static async executeMovement(params: {
    type: "SALE" | "PAYOUT" | "REFUND" | "ADJUSTMENT";
    description: string;
    entries: LedgerEntryInput[];
    metadata?: any;
  }) {
    const total = params.entries.reduce(
      (acc, entry) => acc.plus(new Decimal(entry.amount.toString())),
      new Decimal(0)
    );

    if (!total.isZero()) {
      throw new Error(`Accounting Error: Debit/Credit mismatch (${total.toString()}).`);
    }

    return await prisma.$transaction(async (tx) => {
      const group = await tx.ledgerGroup.create({
        data: {
          type: params.type,
          description: params.description,
          metadata: params.metadata,
        },
      });

      for (const entry of params.entries) {
        const amount = new Decimal(entry.amount.toString());

        // 1. Immutable Ledger Entry
        await tx.ledgerEntry.create({
          data: {
            groupId: group.id,
            walletId: entry.walletId,
            accountId: entry.walletId, 
            amount: amount,
          },
        });

        // 2. Atomic Balance Update
        await tx.wallet.update({
          where: { id: entry.walletId },
          data: {
            [entry.bucket]: { increment: amount },
          },
        });
      }

      return group;
    });
  }

  /**
   * Safe Payout Lock: Available -> Pending (Locked)
   * Guaranteed to fail if account is frozen or funds are insufficient.
   */
  static async lockFundsForPayout(userId: string, amount: number) {
    const amt = new Decimal(amount.toString());
    
    return await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet) throw new Error("Wallet not found.");
      if (wallet.isFrozen) throw new Error("Account is frozen.");
      if (wallet.availableBalance.lessThan(amt)) throw new Error("Insufficient funds.");

      return await tx.wallet.update({
        where: { userId },
        data: {
          availableBalance: { decrement: amt },
          pendingBalance:   { increment: amt },
        },
      });
    });
  }
}
