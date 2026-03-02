import { PrismaClient } from '@prisma/client';
import { updateItemState } from '../services/items/itemStateService';
import { ItemState } from '../domain/enums';

const prisma = new PrismaClient();

export async function runCooldownRelease() {
  const now = new Date();

  const items = await prisma.item.findMany({
    where: {
      state: ItemState.COOLDOWN,
      cooldownUntil: { lte: now },
    },
  });

  for (const item of items) {
    await updateItemState(item.id, ItemState.LISTED);
  }

  console.log(`Cooldown released for ${items.length} items`);
}
