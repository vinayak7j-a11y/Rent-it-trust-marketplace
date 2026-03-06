import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function logAdminAction(
  adminId: string,
  action: string,
  targetId: string,
  metadata?: any
) {

  return prisma.adminActionLog.create({
    data: {
      adminId,
      action,
      targetId,
      metadata: metadata ? JSON.stringify(metadata) : undefined
    }
  });

}