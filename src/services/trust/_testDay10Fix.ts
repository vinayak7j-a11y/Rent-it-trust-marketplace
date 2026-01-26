import { getDepositMultiplier } from '../../rules/trust/depositRules';
import { resolveTrustTier } from './trustTierService';
import { getBookingAccessLevel } from '../../rules/trust/eligibilityRules';

const scores = [0, 15, 60];

for (const score of scores) {
  const tier = resolveTrustTier(score);
  const multiplier = getDepositMultiplier(tier);
  const access = getBookingAccessLevel(tier);

  console.log({
    score,
    tier,
    depositCalc: `base * ${multiplier.num}/${multiplier.den}`,
    bookingAccess: access,
  });
}
