import { PrismaClient } from '@prisma/client';
import { canSuggestMore } from '../../rules/demand/suggestionRules';

const prisma = new PrismaClient();

export async function suggestItemToDemand(
  demandId: string,
  itemId: string
) {
  const demand = await prisma.demandRequest.findUnique({
    where: { id: demandId },
  });

  if (!demand) throw new Error('Demand not found');

  if (demand.status !== 'active') {
    throw new Error('Cannot suggest to inactive demand');
  }

  const existing = await prisma.demandSuggestion.findMany({
    where: { demandId },
  });

  if (!canSuggestMore(existing.length)) {
    throw new Error('Maximum suggestions reached');
  }

  return prisma.demandSuggestion.create({
    data: {
      demandId,
      itemId,
    },
  });
}