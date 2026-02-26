import { prisma } from '../../infra/db/prisma';
import { validateItemFit } from '../../rules/fit/itemFitValidation';

export async function updateItemFit(
  itemId: string,
  data: any,
  userId: string,
  userRole: string
) {
  validateItemFit(data);

  const item = await prisma.item.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    throw new Error('Item not found');
  }

  // If not admin, must own item
  if (userRole !== 'admin' && item.ownerId !== userId) {
    throw new Error('Not authorized to modify this item');
  }

  return prisma.item.update({
    where: { id: itemId },
    data: {
      garmentChestCm: data.garmentChestCm,
      garmentWaistCm: data.garmentWaistCm,
      garmentLengthCm: data.garmentLengthCm,
      stretchability: data.stretchability,
      fitType: data.fitType,
    },
  });
}