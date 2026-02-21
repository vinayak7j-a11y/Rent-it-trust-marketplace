import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function hasConditionSnapshot(itemId: string): Promise<boolean> {
  const snapshot = await prisma.conditionSnapshot.findFirst({
    where: { itemId },
  });

  return !!snapshot;
}