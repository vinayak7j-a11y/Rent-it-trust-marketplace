import { Prisma } from '@prisma/client';

export async function lockEscrow(
  walletId: string,
  amount: number,
  tx: Prisma.TransactionClient
) {
  if (amount <= 0) {
    throw new Error('Invalid escrow amount');
  }

  const wallet = await tx.wallet.findUnique({
    where: { id: walletId },
  });

  if (!wallet) {
    throw new Error('Wallet not found');
  }

  if (wallet.availableBalance < amount) {
    throw new Error('Insufficient available balance');
  }

  await tx.wallet.update({
    where: { id: walletId },
    data: {
      availableBalance: wallet.availableBalance - amount,
      escrowBalance: wallet.escrowBalance + amount,
    },
  });

  await tx.ledgerEntry.create({
    data: {
      walletId,
      amount,
      type: 'escrow_lock',
      reason: 'Funds moved to escrow',
    },
  });
}