import { getTrustContext } from '../trust/trustContextService';
import { canCreateDemand, demandExpiryDate, DEMAND_FEE } from '../../rules/demand/demandRules';
import { getOrCreateWallet } from '../wallet/walletService';
import { appendLedgerEntry } from '../wallet/ledgerService';
import { BookingAccessLevel } from '../../domain/enums'; 
import { prisma } from '../../infra/db/prisma';

export async function createDemand(userId: string, data: any) {
  const trust = await getTrustContext(userId);

  if (trust.bookingAccess === BookingAccessLevel.BLOCKED) {
    throw new Error('Not eligible to create demand');
  }

  if (!canCreateDemand(trust.tier)) {
    throw new Error('Not eligible to create demand');
  }

  return prisma.$transaction(async (tx) => {

    const existing = await tx.demandRequest.findFirst({
      where: {
        userId,
        status: 'active',
      },
    });

    if (existing) {
      throw new Error('Only one active demand allowed');
    }

    let wallet = await tx.wallet.findUnique({
  where: { userId },
});

if (!wallet) {
  wallet = await tx.wallet.create({
    data: { userId },
  });
}

    await appendLedgerEntry({
      walletId: wallet.id,
      amount: DEMAND_FEE,
      type: 'debit',
      reason: 'Demand request fee',
      tx,
    });

    return tx.demandRequest.create({
      data: {
        userId,
        zone: data.zone,
        category: data.category,
        gender: data.gender,
        size: data.size,
        eventDate: new Date(data.eventDate),
        status: 'active',
        expiresAt: demandExpiryDate(),
        feePaid: DEMAND_FEE,
      },
    });
  });
}