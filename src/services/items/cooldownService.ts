import { PrismaClient } from '@prisma/client';
import { getCooldownDays } from '../../rules/condition/cooldownRules';
import { updateItemState } from './itemStateService';
import { ItemState } from '../../domain/enums';

const prisma = new PrismaClient();

export async function applyCooldown(itemId: string) {
  const item = await prisma.item.findUnique({ where: { id: itemId } });

  if (!item) {
    throw new Error('Item not found');
  }

  const days = getCooldownDays(item.fabric);
  const now = new Date();
  const cooldownUntil = new Date(now);
  cooldownUntil.setDate(now.getDate() + days);

  await prisma.item.update({
    where: { id: itemId },
    data: {
      lastReturnedAt: now,
      cooldownUntil,
    },
  });

  await updateItemState(itemId, ItemState.COOLDOWN);

  return cooldownUntil;
}
