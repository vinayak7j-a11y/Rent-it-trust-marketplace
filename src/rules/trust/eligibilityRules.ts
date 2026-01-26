import { TrustTier } from '../../domain/enums';

export function canRequestBooking(tier: TrustTier): boolean {
  return tier !== TrustTier.LOW;
}

export function canAccessPremiumItems(tier: TrustTier): boolean {
  return tier === TrustTier.HIGH;
}
