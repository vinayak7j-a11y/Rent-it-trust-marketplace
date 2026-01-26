import { getTrustContext } from './trustContextService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  await prisma.user.upsert({
    where: { id: 'low' },
    update: { trustScore: 0 },
    create: {
      id: 'low',
      phone: '9111111111',
      role: 'renter',
      status: 'active',
      language: 'en',
      trustScore: 0,
    },
  });

  await prisma.user.upsert({
    where: { id: 'high' },
    update: { trustScore: 60 },
    create: {
      id: 'high',
      phone: '9222222222',
      role: 'renter',
      status: 'active',
      language: 'en',
      trustScore: 60,
    },
  });

  console.log(await getTrustContext('low'));
  console.log(await getTrustContext('high'));
}

test();
