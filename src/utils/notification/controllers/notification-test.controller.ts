import { Controller, Get } from '@nestjs/common';
import { EventConsumerService } from '../services/event.consumer.service';

import { EventNameEnum } from '../enums/event-name.enum';
import { SmsService } from '../services/sms.service';
import { EventPublisherService } from '../services/event-publisher.service';

@Controller('notifications')
export class NotificationTest {
  constructor(
    private eventConsumerService: EventConsumerService,
    private smsService: SmsService,
    private eventPublisher: EventPublisherService,
  ) {}
  @Get('test')
  async testNotification(): Promise<string> {
    return 'notification base setup';
  }

  @Get('order-placed')
  async sendOrderPlacedNotification(): Promise<void> {
    this.eventPublisher.emitEvent(EventNameEnum.ORDER_PLACED, {
      name: 'Atul singh',
    });
  }

  @Get('sms')
  async sendSms(): Promise<void> {
    await this.smsService.sendSms('+918881157770', 'Hello first message');
  }
}
