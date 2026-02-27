import { prisma } from '../../infra/db/prisma'; 

export async function getOrCreateWallet(userId: string) {
  console.log("Wallet service called for:", userId);

  let wallet = await prisma.wallet.findUnique({
    where: { userId },
  });

  if (!wallet) {
    console.log("Creating new wallet");
    wallet = await prisma.wallet.create({
      data: { 
        userId,
        balance: 0,
      },
    });
  }

  return wallet;
}