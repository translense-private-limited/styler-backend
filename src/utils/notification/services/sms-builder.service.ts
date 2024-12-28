import { Injectable } from '@nestjs/common';
import { EventInterface } from '../interfaces/event.interface';
import { EventConfigurationInterface } from '../interfaces/event.configuration.interface';
import { EventDataInterface } from '../interfaces/event-data.interface';
import { UserTypeEnum } from '@modules/authorization/enums/user-type.enum';
import { ClientExternalService } from '@modules/client/client/services/client-external.service';
import { CustomerExternalService } from '@modules/customer/services/customer-external.service';
import * as Handlebars from 'handlebars';
import { SinchSmsService } from './sinch-sms-service';

@Injectable()
export class SmsBuilderService {
  private to: string[] = [];
  private message: string = '';

  constructor(
    private clientExternalService: ClientExternalService,
    private customerExternalService: CustomerExternalService,
    private smsService: SinchSmsService,
  ) {}

  async buildAndDispatchSms(
    event: EventInterface,
    eventConfiguration: EventConfigurationInterface,
  ): Promise<void> {
    await this.buildTo(event, eventConfiguration);
    await this.buildMessage(eventConfiguration.smsTemplate, event.data);

    this.to.forEach(async (to) => {
      await this.smsService.sendSms(`${to}`, this.message);
    });
  }

  private async buildTo(
    event: EventInterface,
    eventConfiguration: EventConfigurationInterface,
  ): Promise<void> {
    if (eventConfiguration.targetUser.includes(UserTypeEnum.CLIENT)) {
      const clientId = event.identity.clientId;
      if (clientId) {
        const client = await this.clientExternalService.getClientById(clientId);
        if (client.contactNumber) {
          this.to.push(client.contactNumber);
        }
      }
    }

    if (eventConfiguration.targetUser.includes(UserTypeEnum.CUSTOMER)) {
      const customerId = event.identity.customerId;
      if (customerId) {
        const customer =
          await this.customerExternalService.getCustomerByIdOrThrow(customerId);
        if (customer.contactNumber) {
          this.to.push(customer.contactNumber + '');
        }
      }
    }
  }

  private buildMessage(
    smsTemplate: string,
    eventData: EventDataInterface,
  ): void {
    const compiledTemplate = Handlebars.compile(smsTemplate);
    const message = compiledTemplate(eventData);
    this.message = message;
  }
}
