import { Prisma } from '@prisma/client';
import { prisma } from '../../infra/db/prisma';
import { releaseEscrow } from '../escrow/escrowReleaseService';
import { BookingState, ItemState } from '../../domain/enums';

export async function cancelBooking(
  bookingId: string,
  userId: string,
  externalTx?: Prisma.TransactionClient
) {
  const run = async (tx: Prisma.TransactionClient) => {

    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new Error('Unauthorized cancellation');
    }

    if (booking.state === BookingState.PICKED_UP) {
      throw new Error('Cannot cancel after pickup');
    }

    if (
      booking.state === BookingState.RETURNED ||
      booking.state === BookingState.CLOSED ||
      booking.state === BookingState.CANCELLED
    ) {
      throw new Error('Booking already completed');
    }

    const item = await tx.item.findUnique({
      where: { id: booking.itemId },
    });

    if (!item) {
      throw new Error('Item not found');
    }

    // Refund logic
    if (booking.state === BookingState.REQUESTED) {
      await releaseEscrow(
        {
          bookingId,
          renterId: booking.userId,
          ownerId: item.ownerId,
          rentalFee: booking.rentalFee,
          deposit: booking.deposit,
          damageCharge: 0,
        },
        tx
      );
    }

    if (booking.state === BookingState.APPROVED) {
      const penalty = Math.floor(booking.rentalFee * 0.10);

      await releaseEscrow(
        {
          bookingId,
          renterId: booking.userId,
          ownerId: item.ownerId,
          rentalFee: penalty,
          deposit: booking.deposit,
          damageCharge: 0,
        },
        tx
      );
    }

    // Update booking state
    await tx.booking.update({
      where: { id: bookingId },
      data: { state: BookingState.CANCELLED },
    });

    // 🔥 IMPORTANT: Unlock item back to LISTED
    await tx.item.update({
      where: { id: booking.itemId },
      data: { state: ItemState.LISTED },
    });
  };

  if (externalTx) {
    return run(externalTx);
  }

  return prisma.$transaction(run);
}