import { PrismaClient } from '@prisma/client';
import { DemandStatus } from '../../domain/enums';

const prisma = new PrismaClient();

export async function getUserSuggestions(userId: string) {
  return prisma.demandSuggestion.findMany({
    where: {
      demand: {
        userId,
        status: DemandStatus.ACTIVE,
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