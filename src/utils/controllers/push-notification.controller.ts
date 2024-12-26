import { Controller, Post, Body } from '@nestjs/common';
import { PushNotificationService } from '../services/push-notification.service'; // Service to handle notification logic
import { RegisterDeviceTokenDto } from '../dtos/register-device-token.dto';
import { EventInterface } from '../interfaces/event.interface';
import { EventConfigurationInterface } from '../interfaces/event-configuration.interface';
import { PushNotificationBuilderService } from '../services/push-notification-builder.service';
import { Public } from '../decorators/public.decorator';

@Controller('notifications')
@Public()
export class PushNotificationController {
  constructor(private readonly pushNotificationService: PushNotificationService,
    private readonly pushNotificationBuilderService:PushNotificationBuilderService
  ) {}

  @Post('/register-token')
  async registerDeviceToken(@Body() registerDeviceTokenDto: RegisterDeviceTokenDto): Promise<void> {
    await this.pushNotificationService.registerDeviceToken(registerDeviceTokenDto);
  }

  @Post('/send')
  async sendNotification(
    @Body() { event, eventConfiguration }: { event: EventInterface; eventConfiguration: EventConfigurationInterface },
  ): Promise<void> {
    await this.pushNotificationBuilderService.buildAndDispatchNotification(event, eventConfiguration);
  }


}
