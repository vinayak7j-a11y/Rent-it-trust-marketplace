import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DECAY_AFTER_DAYS = 30;
const DAILY_DECAY = 1;

export async function runTrustDecay() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - DECAY_AFTER_DAYS);

  const usersToDecay = await prisma.user.findMany({
   where: {
  trustScore: { gt: 0 },
  OR: [
    { lastTrustEventAt: null },
    { lastTrustEventAt: { lt: cutoffDate } },
  ],
},

  });

  for (const user of usersToDecay) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        trustScore: Math.max(user.trustScore - DAILY_DECAY, 0),
      },
    });
  }

  console.log(`Trust decay applied to ${usersToDecay.length} users`);
}
