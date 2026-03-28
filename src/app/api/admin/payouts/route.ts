import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { LedgerGroupType, PayoutStatus, AccountType } from '@prisma/client';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const isAdmin = session?.user?.role === 'SUPER_ADMIN' || session?.user?.role === 'FINANCE_ADMIN';
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Fetch all PENDING payout requests
    const groups = await prisma.ledgerGroup.findMany({
      where: {
        type: LedgerGroupType.PAYOUT_REQUEST,
        status: PayoutStatus.PENDING,
      },
      include: {
        entries: {
          include: {
            account: {
              include: {
                // User info is linked to the FinancialAccount
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    // Map to a cleaner format for the UI
    const formattedPayouts = await Promise.all(groups.map(async (group) => {
      const negativeEntry = group.entries.find(e => e.amount.toNumber() < 0);
      const account = negativeEntry ? await prisma.financialAccount.findUnique({
        where: { id: negativeEntry.accountId },
        include: { 
            // We need the user
        }
      }) : null;

      // Find user from userId in account
      const user = account?.userId ? await prisma.user.findUnique({
        where: { id: account.userId },
        select: { name: true, email: true }
      }) : null;

      return {
        id: group.id,
        status: group.status,
        createdAt: group.createdAt,
        amount: Math.abs(negativeEntry?.amount.toNumber() || 0),
        userName: user?.name || user?.email || 'Unknown User',
      };
    }));

    return NextResponse.json(formattedPayouts);
  } catch (error) {
    console.error('Admin Fetch Payouts Error:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
