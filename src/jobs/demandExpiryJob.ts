import { prisma } from '../infra/db/prisma';

export async function expireDemands() {
  const now = new Date();

  const expired = await prisma.demandRequest.updateMany({
    where: {
      status: 'active',
      expiresAt: {
        lt: now,
      },
    },
    data: {
      status: 'expired',
    },
  });

  if (expired.count > 0) {
    console.log(`Expired ${expired.count} demands`);
  }
}