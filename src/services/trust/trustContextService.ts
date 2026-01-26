import { PrismaClient } from '@prisma/client';
import { resolveTrustTier } from './trustTierService';
import { getDepositMultiplier } from '../../rules/trust/depositRules';
import { getBookingAccessLevel } from '../../rules/trust/eligibilityRules';

const prisma = new PrismaClient();

export async function getTrustContext(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const tier = resolveTrustTier(user.trustScore);

  // Assumes trustScore is up-to-date (see trust decay job)
  return {
    trustScore: user.trustScore,
    tier,
    depositMultiplier: getDepositMultiplier(tier),
    bookingAccess: getBookingAccessLevel(tier),
  };
}
