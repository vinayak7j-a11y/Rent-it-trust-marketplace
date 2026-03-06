import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getPendingBookings() {

  return prisma.booking.findMany({
    where: {
      state: 'requested'
    },
    include: {
      item: true,
      user: true
    }
  });

}