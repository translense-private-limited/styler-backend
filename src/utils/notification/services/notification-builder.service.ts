import { EventNameEnum } from '../enums/event-name.enum';
import { EventConfigurationInterface } from '../interfaces/event.configuration.interface';
import { EventInterface } from '../interfaces/event.interface';
import { EventConfigurationService } from './event-configuration.service';
import { NotificationTypeEnum } from '../enums/notification-type.enum';

import { EmailBuilderService } from './email-builder.service';
import { Injectable } from '@nestjs/common';
import { SmsBuilderService } from './sms-builder.service';

// decide the notification

@Injectable()
export class NotificationBuilderService {
  constructor(
    private readonly eventConfigurationService: EventConfigurationService,
    private emailBuilderService: EmailBuilderService,
    private smsBuilderService: SmsBuilderService,
  ) {}
  async notificationBuilder(event: EventInterface): Promise<void> {
    const eventConfiguration = await this.getEventConfiguration(
      event.eventName,
    );

    if (
      eventConfiguration.notificationType.includes(NotificationTypeEnum.EMAIL)
    ) {
      await this.emailBuilder(eventConfiguration, event);
    }
    if (
      eventConfiguration.notificationType.includes(NotificationTypeEnum.SMS)
    ) {
      await this.smsBuilder(eventConfiguration, event);
    }
    if (
      eventConfiguration.notificationType.includes(
        NotificationTypeEnum.PUSH_NOTIFICATION,
      )
    ) {
      // this.pushNotificationBuilder(eventConfiguration);
    }
  }

  private async getEventConfiguration(
    // eslint-disable-next-line no-unused-vars
    eventName: EventNameEnum,
  ): Promise<EventConfigurationInterface> {
    const eventConfiguration: EventConfigurationInterface =
      await this.eventConfigurationService.getEventConfigurationByEventName(
        eventName,
      );
    return eventConfiguration;
  }

  private async emailBuilder(
    eventConfiguration: EventConfigurationInterface,
    event: EventInterface,
  ): Promise<void> {
    await this.emailBuilderService.buildAndDispatchEmail(
      event,
      eventConfiguration,
    );
    return;
  }
  private async smsBuilder(
    eventConfiguration: EventConfigurationInterface,
    event: EventInterface,
  ): Promise<void> {
    await this.smsBuilderService.buildAndDispatchSms(event, eventConfiguration);
    return;
  }

  // private pushNotificationBuilder(
  //   eventConfiguration: EventConfigurationInterface,
  // ): Promise<void> {
  //   return;
  // }
}
