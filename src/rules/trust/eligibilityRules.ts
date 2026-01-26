import { TrustTier } from '../../domain';


export type BookingAccessLevel = 'blocked' | 'restricted' | 'full';

/**
 * Determines how a user can book, not just whether they can.
 */
export function getBookingAccessLevel(
  tier: TrustTier
): BookingAccessLevel {
  switch (tier) {
    case TrustTier.HIGH:
      return 'full';

    case TrustTier.MEDIUM:
      return 'full';

    case TrustTier.LOW:
      return 'restricted';
  }
}
