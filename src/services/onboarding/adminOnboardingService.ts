import { UserRole } from '../../domain/enums';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function reviewApplication(
  applicationId: string,
  adminId: string,
  decision: 'approved' | 'rejected'
) {
  const app = await prisma.onboardingApplication.findUnique({
    where: { id: applicationId },
  });

  if (!app) throw new Error('Application not found');

  if (decision === 'approved') {
    await prisma.user.update({
      where: { id: app.userId },
      data: { role: app.type === 'owner' ? UserRole.OWNER : UserRole.SHOP },
    });
  }

  return prisma.onboardingApplication.update({
    where: { id: applicationId },
    data: {
      status: decision,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    },
  });
}