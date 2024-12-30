import { ClientExternalService } from './../../../modules/client/client/services/client-external.service';
// this service is responsible to build the
import * as Handlebars from 'handlebars';

import { EventConfigurationInterface } from '../interfaces/event.configuration.interface';
import { EventInterface } from '../interfaces/event.interface';
import { UserTypeEnum } from '@modules/authorization/enums/user-type.enum';
import { CustomerExternalService } from '@modules/customer/services/customer-external.service';
import { EventDataInterface } from '../interfaces/event-data.interface';
import { EmailTemplateInterface } from '../interfaces/email-template.interface';
import { EmailBuilderDto } from '../dtos/email-builder.dto';
import { EmailService } from './email.service';
import { Injectable } from '@nestjs/common';
import { EmailRecipientInterface } from '../interfaces/email-recipient.interface';
@Injectable()
export class EmailBuilderService {
  private to: EmailRecipientInterface[] = [];
  private cc: EmailRecipientInterface[] = [];
  private subject: string = '';
  private body: string = '';
  constructor(
    private clientExternalService: ClientExternalService,
    private customerExternalService: CustomerExternalService,
    private emailService: EmailService,
  ) {}

  async buildAndDispatchEmail(
    event: EventInterface,
    eventConfiguration: EventConfigurationInterface,
  ): Promise<void> {
    const emailBuilderDto = await this.getEmailBuilderDto(
      event,
      eventConfiguration,
    );
    await this.emailService.sendEmail(emailBuilderDto);
  }
  private async getEmailBuilderDto(
    event: EventInterface,
    eventConfiguration: EventConfigurationInterface,
  ): Promise<EmailBuilderDto> {
    await this.buildTo(eventConfiguration, event);
    await this.buildCC(eventConfiguration, event);
    await this.buildSubject(eventConfiguration.emailTemplate, event.data);
    await this.buildEmailBody(eventConfiguration.emailTemplate, event);

    const emailBuilderDto = new EmailBuilderDto();

    emailBuilderDto.to = this.to;
    emailBuilderDto.cc = this.cc;
    emailBuilderDto.subject = this.subject;
    emailBuilderDto.body = this.body;

    return emailBuilderDto;
  }

  //async buildBCC(){}

  private async buildTo(
    eventConfiguration: EventConfigurationInterface,
    event: EventInterface,
  ): Promise<void> {
    const customerId = event.identity.customerId;
    const clientId = event.identity.clientId;
    const targetUser = eventConfiguration.targetUser;
    if (targetUser.includes(UserTypeEnum.CUSTOMER)) {
      const customer =
        await this.customerExternalService.getCustomerByIdOrThrow(customerId);
      this.to.push({ name: customer.name, email: customer.email });
    }
    if (targetUser.includes(UserTypeEnum.CLIENT)) {
      const client = await this.clientExternalService.getClientById(clientId);
      this.to.push({ name: client.name, email: client.email });
    }
  }

  private async buildCC(
    eventConfiguration: EventConfigurationInterface,
    event: EventInterface,
  ): Promise<string[]> {
    if (
      eventConfiguration.targetUser.length === 1 &&
      eventConfiguration.targetUser[0] === UserTypeEnum.CUSTOMER
    ) {
      this.cc = [];
      return;
    }
    const outletId = event.identity.outletId;
    const roles = eventConfiguration.targetClientRoles;

    const clients =
      await this.clientExternalService.getClientByOutlet(outletId);

    // Filter the clients based on the role and isSystemDefined
    const filteredClients = clients.filter((client) => {
      const roleName = client.role?.name; // Ensure the role exists in the client
      const isSystemDefined = client.role?.isSystemDefined; // Check if role is system-defined

      // Check if the role is in the target roles and is system-defined
      return roles.includes(roleName) && isSystemDefined;
    });

    // Extract the emails from the filtered clients
    const ccEmails = filteredClients.map((client) => ({
      email: client.email,
      name: client.name,
    }));
    this.cc = ccEmails;
  }

  private buildSubject(
    emailTemplate: EmailTemplateInterface,
    eventData: EventDataInterface,
  ): void {
    // use handle bar to fix it
    const subjectTemplate = emailTemplate.subject;
    const compiledTemplate = Handlebars.compile(subjectTemplate);
    const subject = compiledTemplate(eventData);
    this.subject = subject;
  }

  private buildEmailBody(
    emailTemplate: EmailTemplateInterface,
    eventData: EventInterface,
  ): void {
    const emailBodyTemplate = emailTemplate.body;
    const compiledEmailBodyTemplate = Handlebars.compile(emailBodyTemplate);
    const emailBody = compiledEmailBodyTemplate(eventData.data);
    this.body = emailBody;
  }
}
