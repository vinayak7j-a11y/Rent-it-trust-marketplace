import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getOrCreateWallet(userId: string) {
  let wallet = await prisma.wallet.findUnique({
    where: { userId },
  });

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: { userId },
    });
  }

  return wallet;
}
