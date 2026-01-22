import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  console.log('Prisma connected successfully');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
