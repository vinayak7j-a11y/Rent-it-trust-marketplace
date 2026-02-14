export function getCooldownDays(fabric: string): number {
  switch (fabric.toLowerCase()) {
    case 'silk':
      return 5;

    case 'linen':
      return 4;

    case 'cotton':
      return 3;

    case 'polyester':
      return 2;

    default:
      return 3;
  }
}
