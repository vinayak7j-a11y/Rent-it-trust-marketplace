export function canBeListed(state: string): boolean {
  return state === 'verified' || state === 'listed';
}
