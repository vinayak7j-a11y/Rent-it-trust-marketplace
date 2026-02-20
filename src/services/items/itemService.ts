import { PrismaClient } from '@prisma/client';
import { ItemState } from '../../domain/enums';

const prisma = new PrismaClient();

type CreateItemInput = {
  ownerId: string;
  category: string;
  gender: string;
  size: string;
  fabric: string;
  wearLevel: string;
  zone: string;
};

export async function createItemIntent(input: CreateItemInput) {
  return prisma.item.create({
    data: {
      ownerId: input.ownerId,
      category: input.category,
      gender: input.gender,
      size: input.size,
      fabric: input.fabric,
      wearLevel: input.wearLevel,
      zone: input.zone,
      state: ItemState.INTENT,
      isVisible: false,
    },
  });
}