export function isItemVisible(item: any): boolean {
  return item.isVisible === true && item.state === 'listed';
}