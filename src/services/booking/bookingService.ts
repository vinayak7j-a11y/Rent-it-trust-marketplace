import { prisma } from '../../infra/db/prisma';
import { Prisma } from '@prisma/client';
import { BookingState, ItemState } from '../../domain/enums';
import { calculateRentalFee, baseDeposit } from '../../rules/booking/bookingRules';
import { getTrustContext } from '../trust/trustContextService';
import { lockEscrow } from '../wallet/escrowService'; 

export async function createBooking(
  userId: string,
  itemId: string,
  startDate: Date,
  endDate: Date
) {
 return prisma.$transaction(async (tx: Prisma.TransactionClient) => {

    const item = await tx.item.findUnique({
      where: { id: itemId },
    });

    if (!item || item.state !== ItemState.LISTED || !item.isVisible) {
      throw new Error('Item not available');
    }

    const existing = await tx.booking.findFirst({
      where: {
        itemId,
        state: { in: [BookingState.REQUESTED, BookingState.APPROVED, BookingState.PICKED_UP] },
      },
    });

    if (existing) {
      throw new Error('Item already booked');
    }

    const trust = await getTrustContext(userId, tx);

    if (!trust.canRequestBooking) { 
      throw new Error('User not eligible to book');
    }

    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) /
      (1000 * 60 * 60 * 24)
    );

    if (days <= 0) {
      throw new Error('Invalid booking duration');
    }

    const rentalFee = calculateRentalFee(days);
    const deposit = Math.floor(
  (baseDeposit() * trust.depositMultiplier.num) /
  trust.depositMultiplier.den
);
    const total = rentalFee + deposit;

    // 🔥 Fit acceptance must match item
  const fitAccepted = await tx.fitAcceptance.findFirst({
  where: {
    userId,
    itemId,
  },
});

if (!fitAccepted) {
  throw new Error('Fit acceptance required for this item');
}
    const wallet = await tx.wallet.findUnique({
      where: { userId },
    });

    if (!wallet || wallet.availableBalance < total) {
      throw new Error('Insufficient balance');
    }

    // 🔥 Use escrow service
    await lockEscrow(wallet.id, total, tx);

    const booking = await tx.booking.create({
      data: {
        userId,
        itemId,
        rentalFee,
        deposit,
        state: BookingState.REQUESTED,
        startDate,
        endDate,
      },
    });

    // 🔥 Use transaction-safe state update
    await tx.item.update({
      where: { id: itemId },
      data: { state: ItemState.BOOKED },
    });

    return booking;
  });
}