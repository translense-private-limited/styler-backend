import { TransactionalEmailsApi } from './../../../../node_modules/@getbrevo/brevo/api/transactionalEmailsApi';
import { EmailBuilderDto } from './../dtos/email-builder.dto';

import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';

import { EnvService } from '@modules/configs/env/services/env.service';
import { NotificationConfigInterface } from '@modules/configs/env/notification.config';
import { EnvNamespaceEnum } from '@modules/configs/env/enums/env-namespace.enum';
import { Exception } from 'handlebars';
import { SendSmtpEmail } from '@getbrevo/brevo/model/sendSmtpEmail';
// eslint-disable-next-line no-undef

// eslint-disable-next-line no-undef, @typescript-eslint/naming-convention
const SibApiV3Sdk = require('sib-api-v3-typescript');
//
//
// import * as SibApiV3Sdk from 'sib-api-v3-typescript';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);
  /**
   * Sends an email based on the provided EmailBuilderDto.
   * @param emailBuilderDto The email details.
   * @returns A promise indicating the status of the email sending operation.
   */

  constructor(private envService: EnvService) {}

  private getEmailDispatcherInstance(): TransactionalEmailsApi {
    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let apiKey = apiInstance.authentications['apiKey'];
    const apiKeyTets = this.envService.getEnvValue<NotificationConfigInterface>(
      EnvNamespaceEnum.NOTIFICATION_CONFIG,
    ).sendInBlueApiKey;
    apiKey.apiKey = apiKeyTets;
    return apiInstance;
  }

  private getSmtpEmailPayload(emailBuilderDto: EmailBuilderDto): SendSmtpEmail {
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = emailBuilderDto.subject;
    sendSmtpEmail.htmlContent = emailBuilderDto.body;
    sendSmtpEmail.sender = {
      name: 'Translense Private Limited',
      email: 'admin@translense.com',
    };

    sendSmtpEmail.to = emailBuilderDto.to;
    if (emailBuilderDto.cc?.length) {
      sendSmtpEmail.cc = emailBuilderDto.cc;
    }
    if (emailBuilderDto.bcc?.length) {
      sendSmtpEmail.bcc = emailBuilderDto.bcc;
    }

    sendSmtpEmail.replyTo = { email: 'replyto@domain.com', name: 'John Doe' };

    return sendSmtpEmail;
  }

  async sendEmail(emailBuilderDto: EmailBuilderDto): Promise<void> {
    let apiInstance;
    try {
      apiInstance = await this.getEmailDispatcherInstance();
    } catch (error) {
      this.logger.error({
        message: `error in email gateway instance preparation`,
        error,
      });
    }

    const smtpEmailPayload = await this.getSmtpEmailPayload(emailBuilderDto);

    try {
      const result = await apiInstance.sendTransacEmail(smtpEmailPayload);
      this.logger.log(`email delivered successfully`, result.body.messageId);
    } catch (error) {
      this.logger.error({
        message: `Email gateway error while dispatching email`,
        error,
      });
      this.logger.debug({
        message: 'Email delivery failed for payload',
        payload: smtpEmailPayload,
      });
      throw new Exception(`Email Delivery failed`);
    }
  }
}
