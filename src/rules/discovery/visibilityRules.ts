import { ItemState } from '../../domain/enums'; 
export function isItemVisible(item: any): boolean {
  return item.isVisible === true && item.state === ItemState.LISTED; 
} 