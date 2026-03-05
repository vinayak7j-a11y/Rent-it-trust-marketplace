import { PrismaClient } from '@prisma/client';
import { createLedgerEntry } from '../wallet/ledgerService';
import { getOrCreateWallet } from '../wallet/walletService';
import { applyTrustEvent } from '../trust/trustService';

const prisma = new PrismaClient();

export async function finalizeBooking(bookingId: string) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { item: true },
    });

    if (!booking) throw new Error('Booking not found');

    if (booking.state !== 'returned') {
      throw new Error('Booking not ready for closure');
    }

    const renterWallet = await getOrCreateWallet(booking.userId);
    const ownerWallet = await getOrCreateWallet(booking.item.ownerId);

    const damagePenalty = booking.damagePenalty || 0;
    const renterRefund = booking.deposit - damagePenalty;

    // Owner payout
    await createLedgerEntry({
      walletId: ownerWallet.id,
      amount: booking.rentalFee,
      type: 'credit',
      reason: 'Rental payout',
      referenceId: bookingId,
      tx,
    });

    // Return remaining deposit
    if (renterRefund > 0) {
      await createLedgerEntry({
        walletId: renterWallet.id,
        amount: renterRefund,
        type: 'credit',
        reason: 'Deposit return',
        referenceId: bookingId,
        tx,
      });
    }

    // Trust update
    await applyTrustEvent({
      userId: booking.userId,
      eventType: 'rental_complete',
      reason: 'Rental outcome',
      referenceId: bookingId,
    });

    await tx.booking.update({
      where: { id: bookingId },
      data: {
        state: 'closed',
        ownerPayoutAt: new Date(),
        depositReleasedAt: new Date(),
        closedAt: new Date(),
      },
    });

    return {
      success: true,
      renterRefund,
      damagePenalty,
    };
  });
}