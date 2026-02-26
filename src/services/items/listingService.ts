import { prisma } from '../../infra/db/prisma';
import { canActivateListing } from '../../rules/listing/listingGuard';
import { hasConditionSnapshot } from '../condition/conditionQueryService';
import { updateItemState } from './itemStateService';
import { ItemState } from '../../domain/enums';

export async function activateListing(
  itemId: string,
  userId: string,
  userRole: string
) {
  return prisma.$transaction(async (tx) => {

    const item = await tx.item.findUnique({
      where: { id: itemId },
    });

    if (!item) throw new Error('Item not found');

    if (userRole !== 'admin' && item.ownerId !== userId) {
      throw new Error('Not authorized to activate this item');
    }

    const hasCondition = await hasConditionSnapshot(itemId);

    const allowed = canActivateListing(item, hasCondition);

    if (!allowed) {
      throw new Error('Item not eligible for listing');
    }

    await updateItemState(itemId, ItemState.LISTED, tx);

    return tx.item.update({
      where: { id: itemId },
      data: { isVisible: true },
    });
  });
}