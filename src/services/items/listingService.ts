import { PrismaClient } from '@prisma/client';
import { canActivateListing } from '../../rules/listing/listingGuard';
import { hasConditionSnapshot } from '../condition/conditionQueryService';
import { updateItemState } from './itemStateService';
import { ItemState } from '../../domain/enums';

const prisma = new PrismaClient();

export async function activateListing(itemId: string) {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
  });

  if (!item) throw new Error('Item not found');

  const hasCondition = await hasConditionSnapshot(itemId);

  const allowed = canActivateListing(item, hasCondition);

  if (!allowed) {
    throw new Error('Item not eligible for listing');
  }

  // Move state → LISTED
  await updateItemState(itemId, ItemState.LISTED);

  // Make visible
  return prisma.item.update({
    where: { id: itemId },
    data: { isVisible: true },
  });
}