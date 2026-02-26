import { TrustTier } from '../../domain/enums';

export function canCreateDemand(tier: TrustTier): boolean {
  return tier !== TrustTier.LOW;
}

export function demandExpiryDate(): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 3); // 3-day window
  return expiry;
}

export const DEMAND_FEE = 19900; // ₹199 in paise