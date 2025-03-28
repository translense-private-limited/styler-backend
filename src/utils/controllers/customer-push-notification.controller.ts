import { Controller, Post, Body } from '@nestjs/common';
import { PushNotificationService } from '../services/push-notification.service'; // Service to handle notification logic
import { DeviceTokenDto } from '../dtos/device-token.dto';
import { EventInterface } from '../interfaces/event.interface';
import { EventConfigurationInterface } from '../interfaces/event-configuration.interface';
import { PushNotificationBuilderService } from '../services/push-notification-builder.service';

@Controller('customer')
export class CustomerPushNotificationController {
  constructor(private readonly pushNotificationService: PushNotificationService,
    private readonly pushNotificationBuilderService:PushNotificationBuilderService
  ) {}

  @Post('/register-token')
  async registerDeviceToken(@Body() deviceTokenDto: DeviceTokenDto): Promise<void> {
    await this.pushNotificationService.registerDeviceToken(deviceTokenDto);
  }

  @Post('notification/send')
  async sendNotification(
    @Body() { event, eventConfiguration }: { event: EventInterface; eventConfiguration: EventConfigurationInterface },
  ): Promise<string> {
    return await this.pushNotificationBuilderService.buildAndDispatchNotification(event, eventConfiguration);
  }
}
