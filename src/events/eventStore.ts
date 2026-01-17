import { DomainEvent } from './event';

const eventStore: DomainEvent[] = [];

/**
 * Append-only event store.
 * Events are never mutated or deleted.
 */
export function appendEvent(event: DomainEvent): void {
  eventStore.push(event);
}

/**
 * Read-only access for debugging/admin.
 */
export function getAllEvents(): readonly DomainEvent[] {
  return eventStore;
}
