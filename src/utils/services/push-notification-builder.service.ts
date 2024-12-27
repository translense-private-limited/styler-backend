import { Injectable } from '@nestjs/common';
import { PushNotificationBuilderDto } from '../dtos/push-notification-builder.dto';
import { EventInterface } from '../interfaces/event.interface';
import { EventConfigurationInterface } from '../interfaces/event-configuration.interface';
import * as Handlebars from 'handlebars';
import { PushNotificationService } from './push-notification.service';
import { DeviceTokenRepository } from '../repositories/device-token.repository';
import { UserTypeEnum } from '@modules/authorization/enums/usertype.enum';

@Injectable()
export class PushNotificationBuilderService {
  private deviceTokens: string[] = [];
  private title: string = '';
  private body: string = '';

  constructor(
    private readonly pushNotificationService: PushNotificationService,
    private readonly deviceTokenRepository: DeviceTokenRepository,
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
    this.buildTitle(eventConfiguration.notificationTemplate, event.metadata);
    this.buildBody(eventConfiguration.notificationTemplate, event.metadata);

    const notificationBuilderDto = new PushNotificationBuilderDto();
    notificationBuilderDto.deviceTokens = this.deviceTokens;
    notificationBuilderDto.title = this.title;
    notificationBuilderDto.body = this.body;

    return notificationBuilderDto;
  }

  private async buildDeviceTokens(
    eventConfiguration: EventConfigurationInterface,
    event: EventInterface,
  ): Promise<void> {
    const targetUser = eventConfiguration.targetUser;
    const userType = event.identity.userType;

    if (targetUser.includes(userType)) {
      const deviceTokens = await this.getDeviceTokensByUser(event.identity.userId, userType);
      this.deviceTokens = [...this.deviceTokens, ...deviceTokens];
    }
  }

  private async getDeviceTokensByUser(userId: number, userType: UserTypeEnum): Promise<string[]> {
    const notifications = await this.deviceTokenRepository.getRepository().find({
      where: { userId, userType },
      select: ['deviceToken'],
    });

    return notifications.map((notification) => notification.deviceToken);
  }

  private buildTitle(
    notificationTemplate: { title: string },
    eventData: Record<string, unknown>,
  ): void {
    const titleTemplate = notificationTemplate.title;
    const compiledTitleTemplate = Handlebars.compile(titleTemplate);
    this.title = compiledTitleTemplate(eventData);
  }

  private buildBody(
    notificationTemplate: { body: string },
    eventData: Record<string, unknown>,
  ): void {
    const bodyTemplate = notificationTemplate.body;
    const compiledBodyTemplate = Handlebars.compile(bodyTemplate);
    this.body = compiledBodyTemplate(eventData);
  }
}
