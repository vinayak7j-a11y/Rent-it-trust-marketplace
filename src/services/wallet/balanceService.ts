import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getWalletBalance(walletId: string): Promise<number> {
  const result = await prisma.ledgerEntry.aggregate({
    where: { walletId },
    _sum: { amount: true },
  });

  return result._sum.amount || 0;
}
