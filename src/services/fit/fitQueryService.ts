import { prisma } from '../../infra/db/prisma';

export async function hasAcceptedFit(userId: string, itemId: string) {
  const record = await prisma.fitAcceptance.findUnique({
    where: {
      userId_itemId: {
        userId,
        itemId,
      },
    },
  });

  return !!record;
}