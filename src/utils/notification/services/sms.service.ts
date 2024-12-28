// this service is responsible to send the sms to recipient

// responsible to configure the third party

// have a primary method send , which will receive the desired payload ,

// and send it .
import { EnvNamespaceEnum } from '@modules/configs/env/enums/env-namespace.enum';
import { NotificationConfigInterface } from '@modules/configs/env/notification.config';
import { EnvService } from '@modules/configs/env/services/env.service';
import { Injectable, Logger } from '@nestjs/common';
import { Exception } from 'handlebars';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly client: Twilio;
  private twilioFrom: string;

  constructor(private envService: EnvService) {
    const { twilioAuthToken, twilioSid, twilioFrom } =
      this.envService.getEnvValue<NotificationConfigInterface>(
        EnvNamespaceEnum.NOTIFICATION_CONFIG,
      );
    this.twilioFrom = twilioFrom;
    const accountSid = twilioSid;
    const authToken = twilioAuthToken;

    if (!accountSid || !authToken) {
      this.logger.error(
        'Twilio credentials are missing in environment variables.',
      );
      throw new Error('Twilio configuration is incomplete.');
    }

    this.client = new Twilio(accountSid, authToken);
  }

  async sendSms(to: string, message: string): Promise<void> {
    const from = this.twilioFrom;
    if (!from) {
      this.logger.error(
        'Twilio phone number is missing in environment variables.',
      );
      throw new Error('Twilio sender phone number is not configured.');
    }

    try {
      const result = await this.client.messages.create({
        to,
        from,
        body: message,
      });
      this.logger.log(`SMS sent successfully to ${to}: ${result.sid}`);
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${to}`);
      console.dir(error);
      throw new Exception('Failed to send SMS');
    }
  }
}
