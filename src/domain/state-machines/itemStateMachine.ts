import { ItemState } from '../';

import { emitEvent } from '../../events/eventEmitter';
import { EventType } from '../../events/eventTypes';


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
emitEvent({
  type: EventType.ITEM_STATE_CHANGED,
  entityType: 'item',
  entityId: 'UNKNOWN', // will be real ID later
  payload: {
    from: current,
    to: next,
  },
});

  return next;
}
