export function trustDeltaFromReturn(damageType: string): number {
  switch (damageType) {
    case 'none':
      return 3;

    case 'minor_stain':
      return 1;

    case 'fabric_pull':
      return -1;

    case 'tear':
      return -3;

    case 'missing_item':
      return -5;

    case 'irreversible_damage':
      return -8;

    default:
      return 0;
  }
}