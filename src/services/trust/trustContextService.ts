import { PrismaClient } from '@prisma/client';
import { resolveTrustTier } from './trustTierService';
import { getDepositMultiplier } from '../../rules/trust/depositRules';
import {
  canRequestBooking,
  canAccessPremiumItems,
} from '../../rules/trust/eligibilityRules';

const prisma = new PrismaClient();

export async function getTrustContext(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const tier = resolveTrustTier(user.trustScore);

  return {
    trustScore: user.trustScore,
    tier,
    depositMultiplier: getDepositMultiplier(tier),
    canRequestBooking: canRequestBooking(tier),
    canAccessPremiumItems: canAccessPremiumItems(tier),
  };
}
