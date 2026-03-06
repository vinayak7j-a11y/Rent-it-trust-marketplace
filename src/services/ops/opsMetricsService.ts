import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getOpsMetrics() {

  const totalBookings = await prisma.booking.count();

  const damagedBookings = await prisma.booking.count({
    where: {
      damageType: {
        not: 'none'
      }
    }
  });

  const damageRate = totalBookings
    ? damagedBookings / totalBookings
    : 0;

  const returnedBookings = await prisma.booking.count({
    where: {
      state: 'returned'
    }
  });

  const lateReturns = await prisma.booking.count({
    where: {
      endDate: {
        lt: new Date()
      },
      state: {
        in: ['picked_up', 'returned']
      }
    }
  });

  const lateReturnRate = returnedBookings
    ? lateReturns / returnedBookings
    : 0;

  return {
    totalBookings,
    damagedBookings,
    damageRate,
    lateReturns,
    lateReturnRate
  };

}