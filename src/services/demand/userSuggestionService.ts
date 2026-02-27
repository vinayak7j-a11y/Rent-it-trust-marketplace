import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getUserSuggestions(userId: string) {
  return prisma.demandSuggestion.findMany({
    where: {
      demand: {
        userId,
        status: 'active',
      },
    },
    include: {
      item: {
        select: {
          id: true,
          category: true,
          gender: true,
          size: true,
          fabric: true,
          wearLevel: true,
        },
      },
    },
  });
}