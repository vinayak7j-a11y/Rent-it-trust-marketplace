import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function detectAbuseSignals() {

  const repeatDamagers = await prisma.booking.groupBy({
    by: ['userId'],
    _count: true,
    where: {
      damageType: {
        not: 'none'
      }
    }
  });

  return repeatDamagers.filter(r => r._count > 2);

}