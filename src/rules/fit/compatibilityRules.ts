import { FitCompatibility } from '../../domain/enums';

type FitInput = {
  userChest?: number;
  userWaist?: number;
  garmentChest: number;
  garmentWaist: number;
  stretchability: string;
};

function toleranceByStretch(stretch: string): number {
  switch (stretch) {
    case 'high': return 6;
    case 'medium': return 4;
    case 'low': return 2;
    default: return 1;
  }
}

export function evaluateFit(input: FitInput): FitCompatibility {
  if (!input.userChest || !input.userWaist) {
    return FitCompatibility.WARNING;
  }

  const tolerance = toleranceByStretch(input.stretchability);

  const chestDiff = Math.abs(input.userChest - input.garmentChest);
  const waistDiff = Math.abs(input.userWaist - input.garmentWaist);

  if (chestDiff <= tolerance && waistDiff <= tolerance) {
    return FitCompatibility.GOOD;
  }

  if (chestDiff <= tolerance * 2 && waistDiff <= tolerance * 2) {
    return FitCompatibility.WARNING;
  }

  return FitCompatibility.HIGH_RISK;
}
