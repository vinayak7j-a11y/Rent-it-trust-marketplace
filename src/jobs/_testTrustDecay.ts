import { PrismaClient } from '@prisma/client';
import { runTrustDecay } from './trustDecayJob';

const prisma = new PrismaClient();

async function test() {
  await prisma.user.upsert({
    where: { id: 'decay-user' },
    update: {},
    create: {
      id: 'decay-user',
      phone: '9333333333',
      role: 'renter',
      status: 'active',
      language: 'en',
      trustScore: 10,
      lastTrustEventAt: new Date('2020-01-01'),
    },
  });

  await runTrustDecay();

  const user = await prisma.user.findUnique({
    where: { id: 'decay-user' },
  });

  console.log('Updated trustScore:', user?.trustScore);
}

test();
