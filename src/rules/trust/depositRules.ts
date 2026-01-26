import { TrustTier } from '../../domain/enums';

/**
 * Deposit multiplier expressed as a ratio to avoid floating-point errors.
 * finalDeposit = baseDeposit * num / den
 */
export function getDepositMultiplier(
  tier: TrustTier
): { num: number; den: number } {
  switch (tier) {
    case TrustTier.HIGH:
      return { num: 1, den: 2 }; // 50%

    case TrustTier.MEDIUM:
      return { num: 1, den: 1 }; // 100%

    case TrustTier.LOW:
      return { num: 2, den: 1 }; // 200%
  }
}
