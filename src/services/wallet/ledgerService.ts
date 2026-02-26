import { PrismaClient, Prisma } from '@prisma/client';

type LedgerEntryInput = {
  walletId: string;
  amount: number; // paise (positive)
  type: 'credit' | 'debit';
  reason: string;
  referenceId?: string;
  tx: Prisma.TransactionClient; // 🔥 important
};

export async function appendLedgerEntry(input: LedgerEntryInput) {
  const { tx } = input;

  if (input.amount <= 0) {
    throw new Error('Ledger amount must be positive');
  }

  const wallet = await tx.wallet.findUnique({
    where: { id: input.walletId },
  });

  if (!wallet) {
    throw new Error('Wallet not found');
  }

  const delta =
    input.type === 'debit' ? -input.amount : input.amount;

  const newBalance = wallet.balance + delta;

  // 🔒 Prevent negative balance
  if (newBalance < 0) {
    throw new Error('Insufficient wallet balance');
  }

  // Update wallet balance
  await tx.wallet.update({
    where: { id: input.walletId },
    data: { balance: newBalance },
  });

  // Append ledger entry
  return tx.ledgerEntry.create({
    data: {
      walletId: input.walletId,
      amount: delta,
      type: input.type,
      reason: input.reason,
      referenceId: input.referenceId,
    },
  });
}