import { Injectable } from '@nestjs/common';
import { EventNameEnum } from '../enums/event-name.enum';
import { EventDataInterface } from '../interfaces/event-data.interface';
import { OrderPlacedEventDataDto } from '../dtos/event-data/order-placed.event-data.dto';

@Injectable()
export class EventDataMapperService {
  // Map of event names to their corresponding DTO classes
  private readonly eventDataMap: Map<EventNameEnum, EventDataInterface> =
    new Map([
      [EventNameEnum.ORDER_PLACED, OrderPlacedEventDataDto],

      // Add more event mappings as needed
    ]);

  /**
   * Gets the corresponding event data DTO for the given event name.
   * @param eventName The name of the event.
   * @returns An instance of the corresponding event data DTO.
   * @throws Error if no mapping is found for the event name.
   */
  getEventDataDto(eventName: EventNameEnum): EventDataInterface {
    const eventDataDto = this.eventDataMap.get(eventName);
    if (!eventDataDto) {
      throw new Error(
        `No event data DTO mapping found for event: ${eventName}`,
      );
    }
    return eventDataDto;
  }
}
