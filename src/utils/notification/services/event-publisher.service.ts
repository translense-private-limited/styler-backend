import { Injectable, Inject, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { EventNameEnum } from '../enums/event-name.enum';
import { EventDataInterface } from '../interfaces/event-data.interface';
import {
  EventIdentityInterface,
  EventInterface,
} from '../interfaces/event.interface';
import { EventConsumerService } from './event.consumer.service';

@Injectable()
export class EventPublisherService {
  private logger = new Logger(EventPublisherService.name);
  constructor(
    private eventConsumerService: EventConsumerService,
    @Inject(REQUEST) private readonly request: Request, // Inject the Request object
  ) {}

  private publishEvent(event: EventInterface): void {
    this.eventConsumerService.consume(event);
  }

  async emitEvent(
    eventName: EventNameEnum,
    eventData: EventDataInterface,
  ): Promise<void> {
    const identity = this.getIdentity(eventData);

    const event: EventInterface = {
      eventName: eventName,
      identity: identity,
      data: eventData,
    };

    this.publishEvent(event);
  }

  private getIdentity(eventData: EventDataInterface): EventIdentityInterface {
    //@ts-ignore
    const customerId = this.request?.user?.customerId ?? null;
    //@ts-ignore
    const clientId = this.request?.user?.clientId ?? null;
    const outletId = this.findOutletId(eventData);

    return { customerId, clientId, outletId };
  }

  private findOutletId(eventData: EventDataInterface): number | null {
    if (eventData && typeof eventData === 'object') {
      for (const key in eventData) {
        if (key === 'outletId') {
          return eventData[key];
        }
        const result = this.findOutletId(eventData[key]);
        if (result !== null) {
          return result;
        }
      }
    }
    return null;
  }
}
