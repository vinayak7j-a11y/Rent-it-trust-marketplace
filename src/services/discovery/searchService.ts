import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SearchInput = {
  zone: string;
  category?: string;
  gender?: string;
  size?: string;
};

export async function searchItems(input: SearchInput) {
  const now = new Date();

  const items = await prisma.item.findMany({
    where: {
      zone: input.zone,
      state: 'listed',
      isVisible: true,
      OR: [
        { cooldownUntil: null },
        { cooldownUntil: { lte: now } },
      ],
      category: input.category,
      gender: input.gender,
      size: input.size,
    },
    select: {
      id: true,
      category: true,
      gender: true,
      size: true,
      fabric: true,
      wearLevel: true,
      garmentChestCm: true,
      garmentWaistCm: true,
      garmentLengthCm: true,
      stretchability: true,
      fitType: true,
    },
    take: 20, // hard cap to enforce scarcity
  });

  return items;
}