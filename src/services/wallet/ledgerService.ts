import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type LedgerEntryInput = {
  walletId: string;
  amount: number; // paise
  type: 'credit' | 'debit';
  reason: string;
  referenceId?: string;
};

export async function appendLedgerEntry(input: LedgerEntryInput) {
  if (input.amount <= 0) {
    throw new Error('Ledger amount must be positive');
  }

  return prisma.ledgerEntry.create({
    data: {
      walletId: input.walletId,
      amount: input.type === 'debit' ? -input.amount : input.amount,
      type: input.type,
      reason: input.reason,
      referenceId: input.referenceId,
    },
  });
}
