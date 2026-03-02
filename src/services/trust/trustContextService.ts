import { PrismaClient, Prisma } from '@prisma/client';
import { resolveTrustTier } from './trustTierService';
import { getDepositMultiplier } from '../../rules/trust/depositRules';
import { getBookingAccessLevel } from '../../rules/trust/eligibilityRules';

const prisma = new PrismaClient();

export async function getTrustContext(
  userId: string,
  tx?: Prisma.TransactionClient
) {
  const db = tx ?? prisma;

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const tier = resolveTrustTier(user.trustScore);

  const bookingAccess = getBookingAccessLevel(tier);

  return {
    trustScore: user.trustScore,
    tier,
    depositMultiplier: getDepositMultiplier(tier),
    canRequestBooking: bookingAccess !== 'blocked',
  };
}