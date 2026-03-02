import { prisma } from '../../infra/db/prisma';

export async function acceptFit(userId: string, itemId: string) {
  return prisma.fitAcceptance.create({
    data: {
      userId,
      itemId,
    },
  });
}