import { prisma } from '../../infra/db/prisma'; 
import { Prisma } from '@prisma/client';
import { releaseEscrow } from '../escrow/escrowReleaseService';

  export async function closeBooking(
  bookingId: string,
  damageCharge?: number
) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {

    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.state !== 'returned') {
      throw new Error('Booking not eligible for close');
    }

    // 🔥 Fetch item to get owner
    const item = await tx.item.findUnique({
      where: { id: booking.itemId },
    });

    if (!item) {
      throw new Error('Item not found');
    }

    await releaseEscrow(
      {
        bookingId,
        renterId: booking.userId,
        ownerId: item.ownerId, // ✅ from item
        rentalFee: booking.rentalFee,
        deposit: booking.deposit,
        damageCharge,
      },
      tx
    );

    await tx.booking.update({
      where: { id: bookingId },
      data: { state: BookingState.CLOSED },
    });
  });
}