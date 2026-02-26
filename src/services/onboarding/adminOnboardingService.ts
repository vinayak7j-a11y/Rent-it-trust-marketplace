import { prisma } from '../../infra/db/prisma';
import { UserRole } from '../../domain/enums';

export async function reviewApplication(
  applicationId: string,
  adminId: string,
  decision: 'approved' | 'rejected'
) {
  return prisma.$transaction(async (tx) => {

    // 🔒 Verify admin exists and is admin
    const admin = await tx.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new Error('Not authorized to review applications');
    }

    const app = await tx.onboardingApplication.findUnique({
      where: { id: applicationId },
    });

    if (!app) throw new Error('Application not found');

    if (app.status !== 'pending') {
      throw new Error('Application already reviewed');
    }

    if (decision === 'approved') {
      await tx.user.update({
        where: { id: app.userId },
        data: {
          role:
            app.type === 'owner'
              ? UserRole.OWNER
              : UserRole.SHOP,
        },
      });
    }

    return tx.onboardingApplication.update({
      where: { id: applicationId },
      data: {
        status: decision,
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
    });
  });
}