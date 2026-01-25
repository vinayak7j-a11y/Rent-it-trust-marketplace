import { PrismaClient } from '@prisma/client';
import { Language } from '../../domain/enums';



const prisma = new PrismaClient();

export async function getActiveRule(language: Language) {
  return prisma.ruleVersion.findFirst({
    where: { isActive: true, language },
    orderBy: { version: 'desc' },
  });
}

export async function acceptActiveRule(userId: string, language: Language) {
  const rule = await getActiveRule(language);
  if (!rule) throw new Error('No active rule found');

  return prisma.userRuleAcceptance.create({
    data: {
      userId,
      ruleVersionId: rule.id,
    },
  });
}

export async function hasAcceptedActiveRule(
  userId: string,
  language: Language
): Promise<boolean> {
  const rule = await getActiveRule(language);
  if (!rule) return false;

  const acceptance = await prisma.userRuleAcceptance.findUnique({
    where: {
      userId_ruleVersionId: {
        userId,
        ruleVersionId: rule.id,
      },
    },
  });

  return Boolean(acceptance);
}
