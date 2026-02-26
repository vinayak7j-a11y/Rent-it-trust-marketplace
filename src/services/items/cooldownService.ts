import { prisma } from '../../infra/db/prisma';
import { getCooldownDays } from '../../rules/condition/cooldownRules';
import { updateItemState } from './itemStateService';
import { ItemState } from '../../domain/enums';

export async function applyCooldown(itemId: string) {
  return prisma.$transaction(async (tx) => {

    const item = await tx.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new Error('Item not found');
    }

    const days = getCooldownDays(item.fabric);

    const now = new Date();
    const cooldownUntil = new Date(now);
    cooldownUntil.setDate(now.getDate() + days);

    await tx.item.update({
      where: { id: itemId },
      data: {
        lastReturnedAt: now,
        cooldownUntil,
      },
    });

    await updateItemState(itemId, ItemState.COOLDOWN, tx);

    return cooldownUntil;
  });
}