import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getActiveDemands() {

  return prisma.demandRequest.findMany({
    where: {
      status: 'active'
    },
    include: {
      user: true
    }
  });

}