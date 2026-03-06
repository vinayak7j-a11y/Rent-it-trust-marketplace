import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getPendingItems() {

  return prisma.item.findMany({
    where: {
      state: 'intent'
    },
    include: {
      owner: true
    }
  });

}