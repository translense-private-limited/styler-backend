import { Injectable } from '@nestjs/common';
import { PushNotificationBuilderDto } from '../dtos/push-notification-builder.dto';
import { EventInterface } from '../interfaces/event.interface';
import { EventConfigurationInterface } from '../interfaces/event-configuration.interface';
import * as Handlebars from 'handlebars';
import { PushNotificationService } from './push-notification.service';
import { DeviceTokenRepository } from '../repositories/device-token.repository';

@Injectable()
export class PushNotificationBuilderService {
  private deviceTokens: string[] = [];
  private title: string = '';
  private body: string = '';
  private data: Record<string, any> = {};

  constructor(private pushNotificationService: PushNotificationService,
    private readonly deviceTokenRepository:DeviceTokenRepository
  ) {}

  async buildAndDispatchNotification(
    event: EventInterface,
    eventConfiguration: EventConfigurationInterface,
  ): Promise<string> {
    const notificationBuilderDto = await this.getNotificationBuilderDto(
      event,
      eventConfiguration,
    );
    return await this.pushNotificationService.sendNotification(notificationBuilderDto);
  }

  private async getNotificationBuilderDto(
    event: EventInterface,
    eventConfiguration: EventConfigurationInterface,
  ): Promise<PushNotificationBuilderDto> {
    await this.buildDeviceTokens(eventConfiguration, event);
    await this.buildTitle(eventConfiguration.notificationTemplate, event.data);
    await this.buildBody(eventConfiguration.notificationTemplate, event.data);
    await this.buildData(event);

    const notificationBuilderDto = new PushNotificationBuilderDto();
    notificationBuilderDto.deviceTokens = this.deviceTokens;
    notificationBuilderDto.title = this.title;
    notificationBuilderDto.body = this.body;
    notificationBuilderDto.data = this.data;

    return notificationBuilderDto;
  }

  private async buildDeviceTokens(
    eventConfiguration: EventConfigurationInterface,
    event: EventInterface,
  ): Promise<void> {
    const targetUser = eventConfiguration.targetUser;
    const userType = event.identity.userType;

    if (targetUser.includes(userType)) {
      const deviceTokens = await this.getDeviceTokensByUser(event.identity.userId);
      this.deviceTokens = [...this.deviceTokens, ...deviceTokens];
    }
  }

  async getDeviceTokensByUser(userId: number): Promise<string[]> {
    // Query the NotificationEntity for the device tokens associated with the userId
    const notifications = await this.deviceTokenRepository.getRepository().find({
      where: { userId },  // Filter by userId
      select: ['deviceToken'], // Only fetch deviceToken field
    });

    // Map over the results and return the deviceToken values
    return notifications.map(notification => notification.deviceToken);
  }

  private buildTitle(
    notificationTemplate: { title: string },
    eventData: Record<string, any>,
  ): void {
    const titleTemplate = notificationTemplate.title;
    const compiledTitleTemplate = Handlebars.compile(titleTemplate);
    this.title = compiledTitleTemplate(eventData);
  }

  private buildBody(
    notificationTemplate: { body: string },
    eventData: Record<string, any>,
  ): void {
    const bodyTemplate = notificationTemplate.body;
    const compiledBodyTemplate = Handlebars.compile(bodyTemplate);
    this.body = compiledBodyTemplate(eventData);
  }

  private buildData(event: EventInterface): void {
    this.data = {
      eventId: event.id,
      eventType: event.type,
      ...event.data, // Add custom event data
    };
  }
}
