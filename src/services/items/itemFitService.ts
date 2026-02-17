import { PrismaClient } from '@prisma/client';
import { validateItemFit } from '../../rules/fit/itemFitValidation';

const prisma = new PrismaClient();

export async function updateItemFit(itemId: string, data: any) {
  validateItemFit(data);

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
