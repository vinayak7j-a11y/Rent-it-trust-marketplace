import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function acceptFitRisk(userId: string, bookingId: string) {
  return prisma.fitAcceptance.create({
    data: { userId, bookingId },
  });
}
