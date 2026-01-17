import { v4 as uuidv4 } from 'uuid';
import { appendEvent } from './eventStore';
import { DomainEvent } from './event';
import { EventType } from './eventTypes';

interface EmitEventInput<T> {
  type: EventType;
  entityType: string;
  entityId: string;
  actorId?: string;
  payload: T;
}

export function emitEvent<T>(input: EmitEventInput<T>): DomainEvent<T> {
  const event: DomainEvent<T> = {
    id: uuidv4(),
    type: input.type,
    entityType: input.entityType,
    entityId: input.entityId,
    actorId: input.actorId,
    payload: input.payload,
    createdAt: new Date(),
  };

  appendEvent(event);
  return event;
}
