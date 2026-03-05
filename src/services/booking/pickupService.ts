import { PrismaClient } from '@prisma/client';
import { updateItemState } from '../items/itemStateService';
import { issueWindowDurationMinutes } from '../../rules/pickup/pickupRules';
import { ItemState } from '../../domain/enums';
import { createConditionSnapshot } from '../condition/conditionService';

const prisma = new PrismaClient();

export async function pickupBooking(
  bookingId: string,
  photoUrls: string[],
  capturedBy: 'shop' | 'agent' | 'admin'
) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { item: true },
  });

  if (!booking) throw new Error('Booking not found');

  if (booking.state !== 'approved') {
    throw new Error('Booking not approved for pickup');
  }

  // Re-verify condition
  await createConditionSnapshot({
    itemId: booking.itemId,
    bookingId,
    photoUrls,
    capturedBy,
  });

  const now = new Date();
  const issueWindow = new Date(
    now.getTime() + issueWindowDurationMinutes() * 60 * 1000
  );

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      state: 'picked_up',
      pickupVerifiedAt: now,
      issueWindowUntil: issueWindow,
    },
  });

  await updateItemState(booking.itemId, ItemState.IN_USE);

  return { success: true };
}