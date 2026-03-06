import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getZoneActivity() {

  return prisma.item.groupBy({
    by: ['zone'],
    _count: {
      id: true
    }
  });

}