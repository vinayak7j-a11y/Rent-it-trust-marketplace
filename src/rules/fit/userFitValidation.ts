export function validateUserFit(input: any) {
  if (input.heightCm && (input.heightCm < 120 || input.heightCm > 220)) {
    throw new Error('Invalid height');
  }

  if (input.weightKg && (input.weightKg < 30 || input.weightKg > 200)) {
    throw new Error('Invalid weight');
  }

  if (input.chestCm && (input.chestCm < 60 || input.chestCm > 160)) {
    throw new Error('Invalid chest');
  }

  if (input.waistCm && (input.waistCm < 50 || input.waistCm > 150)) {
    throw new Error('Invalid waist');
  }
}
