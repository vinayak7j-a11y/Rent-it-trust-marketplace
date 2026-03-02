import { prisma } from '../infra/db/prisma';
import { DemandStatus } from '../domain/enums';
export async function expireDemands() {
  const now = new Date();

  const expired = await prisma.demandRequest.updateMany({
    where: {
      status: DemandStatus.ACTIVE,
      expiresAt: {
        lt: now,
      },
    },
    data: {
      status: DemandStatus.EXPIRED,
    },
  });

  if (expired.count > 0) {
    console.log(`Expired ${expired.count} demands`);
  }
}