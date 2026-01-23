import { TrustEventType } from '../../domain/enums';

export function getTrustDelta(event: TrustEventType): number {
  switch (event) {
    case TrustEventType.CLEAN_RETURN:
      return +5;

    case TrustEventType.REPEATED_GOOD:
      return +10;

    case TrustEventType.LATE_RETURN:
      return -5;

    case TrustEventType.DAMAGE_REPORTED:
      return -20;

    default:
      throw new Error('Unknown trust event');
  }
}
