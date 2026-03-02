import { ItemState } from '../../domain/enums'; 
export function canBeListed(state: string): boolean {
  return state === ItemState.VERIFIED || state === ItemState.LISTED; 
} 