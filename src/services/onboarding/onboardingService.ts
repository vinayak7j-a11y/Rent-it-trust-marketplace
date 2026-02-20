import { PrismaClient } from '@prisma/client';
import { validateApplication } from '../../rules/onboarding/applicationValidation';

const prisma = new PrismaClient();

export async function submitApplication(userId: string, data: any) {
  validateApplication(data);

  return prisma.onboardingApplication.create({
    data: {
      userId,
      type: data.type,
      businessName: data.businessName,
      description: data.description,
      status: 'pending',
    },
  });
}