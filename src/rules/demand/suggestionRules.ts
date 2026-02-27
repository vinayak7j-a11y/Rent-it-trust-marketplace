export function canSuggestMore(existingCount: number): boolean {
  return existingCount < 3;
}