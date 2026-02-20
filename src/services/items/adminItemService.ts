import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getIntentItems() {
  return prisma.item.findMany({
    where: {
      state: 'intent',
    },
  });
}