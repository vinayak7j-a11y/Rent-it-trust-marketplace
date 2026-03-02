import { Prisma } from '@prisma/client';

type LedgerEntryInput = {
  walletId: string;
  amount: number; // positive value only
  type: string;
  reason: string;
  referenceId?: string;
  tx: Prisma.TransactionClient;
};

export async function createLedgerEntry(input: LedgerEntryInput) {
  if (input.amount <= 0) {
    throw new Error('Ledger amount must be positive');
  }

  return input.tx.ledgerEntry.create({
    data: {
      walletId: input.walletId,
      amount: input.amount,
      type: input.type,
      reason: input.reason,
      referenceId: input.referenceId,
    },
  });
}