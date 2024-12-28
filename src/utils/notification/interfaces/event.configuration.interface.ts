import { NotificationTypeEnum } from './../enums/notification-type.enum';
import { UserTypeEnum } from '@modules/authorization/enums/user-type.enum';
import { EventNameEnum } from '../enums/event-name.enum';
import { EmailTemplateInterface } from './email-template.interface';

export interface EventConfigurationInterface {
  eventName: EventNameEnum;
  targetUser: UserTypeEnum[];
  targetClientRoles: string[];
  notificationType: NotificationTypeEnum[];
  emailTemplate?: EmailTemplateInterface;
  smsTemplate?: string;
  pushNotificationTemplate?: string;
}
