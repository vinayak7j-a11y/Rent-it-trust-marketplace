export function validateItemFit(input: any) {
  if (!input.garmentChestCm || input.garmentChestCm < 60 || input.garmentChestCm > 200) {
    throw new Error('Invalid garment chest');
  }

  if (!input.garmentWaistCm || input.garmentWaistCm < 50 || input.garmentWaistCm > 180) {
    throw new Error('Invalid garment waist');
  }

  if (!input.garmentLengthCm || input.garmentLengthCm < 50 || input.garmentLengthCm > 200) {
    throw new Error('Invalid garment length');
  }

  const stretchOptions = ['none', 'low', 'medium', 'high'];
  if (!stretchOptions.includes(input.stretchability)) {
    throw new Error('Invalid stretchability');
  }

  const fitOptions = ['slim', 'regular', 'loose'];
  if (!fitOptions.includes(input.fitType)) {
    throw new Error('Invalid fit type');
  }
}
