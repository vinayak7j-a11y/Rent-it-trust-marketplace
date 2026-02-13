import { PrismaClient } from '@prisma/client';
import { transitionItemState } from '../../domain/state-machines/itemStateMachine';
import { ItemState } from '../../domain/enums';

const prisma = new PrismaClient();

export async function updateItemState(
  itemId: string,
  nextState: ItemState
) {
  const item = await prisma.item.findUnique({ where: { id: itemId } });

  if (!item) {
    throw new Error('Item not found');
  }

  const newState = transitionItemState(
    item.state as ItemState,
    nextState
  );

  return prisma.item.update({
    where: { id: itemId },
    data: { state: newState },
  });
}
