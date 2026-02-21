import { hasCompleteFit } from '../fit/listingFitGuard';

export function canActivateListing(item: any, hasCondition: boolean): boolean {
  if (item.state !== 'verified') return false;

  if (!hasCondition) return false;

  if (!hasCompleteFit(item)) return false;

  if (item.cooldownUntil && new Date(item.cooldownUntil) > new Date()) {
    return false;
  }

  return true;
}