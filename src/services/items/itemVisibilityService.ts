import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function makeItemVisible(itemId: string) {
  return prisma.item.update({
    where: { id: itemId },
    data: { isVisible: true },
  });
}