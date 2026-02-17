import { PrismaClient } from '@prisma/client';
import { evaluateFit } from '../../rules/fit/compatibilityRules';

const prisma = new PrismaClient();

export async function getFitCompatibility(userId: string, itemId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const item = await prisma.item.findUnique({ where: { id: itemId } });

  if (!item) throw new Error('Item not found');

  return evaluateFit({
    userChest: user?.chestCm || undefined,
    userWaist: user?.waistCm || undefined,
    garmentChest: item.garmentChestCm!,
    garmentWaist: item.garmentWaistCm!,
    stretchability: item.stretchability!,
  });
}
