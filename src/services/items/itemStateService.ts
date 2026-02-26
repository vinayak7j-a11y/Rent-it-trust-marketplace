import { Prisma } from '@prisma/client';
import { prisma } from '../../infra/db/prisma';
import { transitionItemState } from '../../domain/state-machines/itemStateMachine';
import { ItemState } from '../../domain/enums';

export async function updateItemState(
  itemId: string,
  nextState: ItemState,
  tx?: Prisma.TransactionClient
) {
  const client = tx ?? prisma;

  const item = await client.item.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    throw new Error('Item not found');
  }

  const newState = transitionItemState(
    item.state as ItemState,
    nextState
  );

  return client.item.update({
    where: { id: itemId },
    data: { state: newState },
  });
}