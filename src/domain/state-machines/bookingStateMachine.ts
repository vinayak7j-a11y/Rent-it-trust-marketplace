import { BookingState } from '../enums';
import { emitEvent } from '../../events/eventEmitter';
import { EventType } from '../../events/eventTypes';

export class InvalidBookingStateTransitionError extends Error {
  constructor(from: BookingState, to: BookingState) {
    super(`Invalid booking state transition: ${from} → ${to}`);
  }
}

const BOOKING_STATE_TRANSITIONS: Record<BookingState, BookingState[]> = {
  [BookingState.REQUESTED]: [BookingState.APPROVED],

  [BookingState.APPROVED]: [BookingState.PICKED_UP],

  [BookingState.PICKED_UP]: [BookingState.RETURNED],

  [BookingState.RETURNED]: [BookingState.CLOSED],

  [BookingState.CLOSED]: [],
};

export function transitionBookingState(
  current: BookingState,
  next: BookingState
): BookingState {
  const allowedNextStates = BOOKING_STATE_TRANSITIONS[current];

  if (!allowedNextStates || !allowedNextStates.includes(next)) {
    throw new InvalidBookingStateTransitionError(current, next);
  }
emitEvent({
  type: EventType.BOOKING_STATE_CHANGED,
  entityType: 'booking',
  entityId: 'UNKNOWN',
  payload: {
    from: current,
    to: next,
  },
});

  return next;
}
