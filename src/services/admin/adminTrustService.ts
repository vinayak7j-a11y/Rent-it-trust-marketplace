import { PrismaClient } from '@prisma/client';
import { logAdminAction } from './adminLogService';

const prisma = new PrismaClient();

export async function overrideTrust(
  adminId: string,
  userId: string,
  newScore: number
) {

  await prisma.user.update({
    where: { id: userId },
    data: { trustScore: newScore }
  });

  await logAdminAction(
    adminId,
    'trust_override',
    userId,
    { newScore }
  );

  return { success: true };

}