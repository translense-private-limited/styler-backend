import { EventNameEnum } from '../enums/event-name.enum';
import { EventTypeEnum } from '../enums/event-type.enum';
import { EventDataInterface } from './event-data.interface';

export interface EventInterface {
  eventName: EventNameEnum;
  eventType?: EventTypeEnum; // this will be used to identify the event type
  identity: EventIdentityInterface;
  data: EventDataInterface;
}

export interface EventIdentityInterface {
  customerId?: number;
  clientId?: number;
  outletId?: number;
}
