import { TrustTier } from '../../domain/enums';

export function getDepositMultiplier(tier: TrustTier): number {
  switch (tier) {
    case TrustTier.HIGH:
      return 0.5; // 50% deposit

    case TrustTier.MEDIUM:
      return 1.0; // standard deposit

    case TrustTier.LOW:
      return 2.0; // double deposit

    default:
      return 2.0;
  }
}
