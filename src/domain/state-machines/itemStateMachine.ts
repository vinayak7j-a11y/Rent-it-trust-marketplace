import { ItemState } from '../enums';

export class InvalidItemStateTransitionError extends Error {
  constructor(from: ItemState, to: ItemState) {
    super(`Invalid item state transition: ${from} → ${to}`);
  }
}

const ITEM_STATE_TRANSITIONS: Record<ItemState, ItemState[]> = {
  [ItemState.INTENT]: [ItemState.AT_HUB],

  [ItemState.AT_HUB]: [ItemState.VERIFIED],

  [ItemState.VERIFIED]: [ItemState.LISTED],

  [ItemState.LISTED]: [ItemState.BOOKED],

  [ItemState.BOOKED]: [ItemState.IN_USE],

  [ItemState.IN_USE]: [ItemState.RETURNED],

  [ItemState.RETURNED]: [ItemState.COOLDOWN],

  [ItemState.COOLDOWN]: [ItemState.LISTED],
};

export function transitionItemState(
  current: ItemState,
  next: ItemState
): ItemState {
  const allowedNextStates = ITEM_STATE_TRANSITIONS[current];

  if (!allowedNextStates || !allowedNextStates.includes(next)) {
    throw new InvalidItemStateTransitionError(current, next);
  }

  return next;
}