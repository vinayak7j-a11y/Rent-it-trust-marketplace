import { getTrustContext } from '../trust/trustContextService';
import { canCreateDemand, demandExpiryDate, DEMAND_FEE } from '../../rules/demand/demandRules';
import { getOrCreateWallet } from '../wallet/walletService';
import { lockEscrow } from '../wallet/escrowService'; 
import { prisma } from '../../infra/db/prisma'; 
import { DemandStatus } from '../../domain/enums';

export async function createDemand(userId: string, data: any) {
  return prisma.$transaction(async (tx) => {

    const trust = await getTrustContext( userId, tx);

    if (!trust.canRequestBooking) {
      throw new Error('Not eligible to create demand');
    }

    if (!canCreateDemand(trust.tier)) {
      throw new Error('Not eligible to create demand');
    }

    const existing = await tx.demandRequest.findFirst({
      where: {
        userId,
        status: DemandStatus.ACTIVE,
      },
    });

    if (existing) {
      throw new Error('Only one active demand allowed');
    }

    // Get or create wallet safely inside transaction
    let wallet = await tx.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      wallet = await tx.wallet.create({
        data: {
          userId,
          availableBalance: 0,
          escrowBalance: 0,
        },
      });
    }

    // 🔥 Always charge fee
    await lockEscrow(wallet.id, DEMAND_FEE, tx);

    const demand = await tx.demandRequest.create({
      data: {
        userId,
        zone: data.zone,
        category: data.category,
        gender: data.gender,
        size: data.size,
        eventDate: new Date(data.eventDate),
        status: DemandStatus.ACTIVE,
        expiresAt: demandExpiryDate(),
        feePaid: DEMAND_FEE,
      },
    });

    return demand;
  });
}