import { PrismaClient } from '@prisma/client';
import { TrustEventType } from '../../domain/enums';
import { getTrustDelta } from '../../rules/trust/trustRules';

const prisma = new PrismaClient();

export async function applyTrustEvent(input: {
  userId: string;
  eventType: TrustEventType;
  reason: string;
  referenceId?: string;
}) {
  const delta = getTrustDelta(input.eventType);

  await prisma.$transaction([
    prisma.trustEvent.create({
      data: {
        userId: input.userId,
        type: input.eventType,
        delta,
        reason: input.reason,
        referenceId: input.referenceId,
      },
    }),
    prisma.user.update({
      where: { id: input.userId },
      data: {
        trustScore: {
          increment: delta,
        },
        lastTrustEventAt: new Date(),
      },
    }),
  ]);
}
