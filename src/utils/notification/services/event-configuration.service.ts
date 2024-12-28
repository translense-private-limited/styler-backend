import { Injectable, NotFoundException } from '@nestjs/common';
import { EventConfigurationRepository } from '../repositories/event-configuration.repository';
import { EventNameEnum } from '../enums/event-name.enum';
import { EventConfigurationEntity } from '../entities/even-configuration.entity';

@Injectable()
export class EventConfigurationService {
  constructor(
    private eventConfigurationRepository: EventConfigurationRepository,
  ) {}

  async getEventConfigurationByEventName(
    eventName: EventNameEnum,
  ): Promise<EventConfigurationEntity> {
    const eventConfiguration =
      await this.getEventConfigurationByEventNameOrThrow(eventName);
    return eventConfiguration;
  }

  private async getEventConfigurationByEventNameOrThrow(
    eventName: EventNameEnum,
  ): Promise<EventConfigurationEntity> {
    const eventConfiguration = await this.eventConfigurationRepository
      .getRepository()
      .findOne({
        where: {
          eventName,
        },
      });

    if (!eventConfiguration) {
      throw new NotFoundException(`Invalid event ${eventName}`);
    }
    return eventConfiguration;
  }
}
