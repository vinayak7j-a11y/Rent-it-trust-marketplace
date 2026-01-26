import { TrustTier } from '../../domain';


export function resolveTrustTier(trustScore: number): TrustTier {
  if (trustScore >= 50) return TrustTier.HIGH;
  if (trustScore >= 10) return TrustTier.MEDIUM;
  return TrustTier.LOW;
}
