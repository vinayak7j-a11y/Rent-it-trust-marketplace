import { PrismaClient } from '@prisma/client';
import { hashPhotos } from './hashService';
import { CONDITION_CHECKLIST } from '../../rules/condition/checklistStandard';

const prisma = new PrismaClient();

type SnapshotInput = {
  itemId: string;
  bookingId: string;
  photoUrls: string[];
  capturedBy: 'shop' | 'agent' | 'admin';
};

export async function createConditionSnapshot(input: SnapshotInput) {
  if (input.photoUrls.length !== CONDITION_CHECKLIST.length) {
    throw new Error('Incomplete condition checklist');
  }

  const photoHash = hashPhotos(input.photoUrls);

  return prisma.conditionSnapshot.create({
    data: {
      itemId: input.itemId,
      bookingId: input.bookingId,
      photoHash,
      checklist: JSON.stringify(input.photoUrls),
      capturedBy: input.capturedBy,
    },
  });
}