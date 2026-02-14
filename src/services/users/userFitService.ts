import { PrismaClient } from '@prisma/client';
import { validateUserFit } from '../../rules/fit/userFitValidation';

const prisma = new PrismaClient();

export async function updateUserFitProfile(userId: string, data: any) {
  validateUserFit(data);

  return prisma.user.update({
    where: { id: userId },
    data: {
      heightCm: data.heightCm,
      weightKg: data.weightKg,
      chestCm: data.chestCm,
      waistCm: data.waistCm,
      fitPreference: data.fitPreference,
    },
  });
}
