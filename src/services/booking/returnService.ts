import { PrismaClient } from '@prisma/client';
import { updateItemState } from '../items/itemStateService';
import { calculateDamagePenalty, DamageType } from '../../rules/damage/damageRules';
import { ItemState } from '../../domain/enums';
import { createConditionSnapshot } from '../condition/conditionService';

const prisma = new PrismaClient();

export async function returnBooking(
  bookingId: string,
  photoUrls: string[],
  damageType: DamageType,
  capturedBy: 'shop' | 'agent' | 'admin'
) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.state !== 'picked_up') {
    throw new Error('Booking not in active use');
  }

  // Capture return condition snapshot
  await createConditionSnapshot({
    itemId: booking.itemId,
    bookingId,
    photoUrls,
    capturedBy,
  });

  const penalty = calculateDamagePenalty(damageType);

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      state: 'returned',
      returnVerifiedAt: new Date(),
      damageType,
      damagePenalty: penalty,
    },
  });

  await updateItemState(booking.itemId, ItemState.RETURNED);

  return {
    success: true,
    penalty,
  };
}