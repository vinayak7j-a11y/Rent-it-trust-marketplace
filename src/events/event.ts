import { EventType } from './eventTypes';

export interface DomainEvent<T = any> {
  id: string;
  type: EventType;

  entityType: string;   // e.g. 'item', 'booking', 'wallet'
  entityId: string;

  actorId?: string;     // user/admin/system
  payload: T;

  createdAt: Date;
}
