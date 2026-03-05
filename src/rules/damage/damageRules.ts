export type DamageType =
  | 'none'
  | 'minor_stain'
  | 'fabric_pull'
  | 'tear'
  | 'missing_item'
  | 'irreversible_damage';

export function calculateDamagePenalty(type: DamageType): number {
  switch (type) {
    case 'none':
      return 0;

    case 'minor_stain':
      return 50000;

    case 'fabric_pull':
      return 100000;

    case 'tear':
      return 200000;

    case 'missing_item':
      return 300000;

    case 'irreversible_damage':
      return 500000;

    default:
      return 0;
  }
}