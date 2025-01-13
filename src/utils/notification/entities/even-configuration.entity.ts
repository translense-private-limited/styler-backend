import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { BaseEntity } from '@src/utils/entities/base.entity';
import { EventConfigurationInterface } from '../interfaces/event.configuration.interface';
import { EventNameEnum } from '../enums/event-name.enum';
import { UserTypeEnum } from '@src/utils/enums/user-type.enum';
import { NotificationTypeEnum } from '../enums/notification-type.enum';
import { EmailTemplateInterface } from '../interfaces/email-template.interface';

@Entity()
export class EventConfigurationEntity
  extends BaseEntity
  implements EventConfigurationInterface
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: EventNameEnum,
  })
  eventName: EventNameEnum;

  @Column('json')
  targetUser: UserTypeEnum[];

  @Column('simple-array')
  targetClientRoles: string[];

  @Column('json')
  notificationType: NotificationTypeEnum[];

  @Column({ type: 'json', nullable: true })
  emailTemplate?: EmailTemplateInterface;

  @Column({ type: 'varchar', nullable: true })
  smsTemplate?: string;

  @Column({ type: 'varchar', nullable: true })
  pushNotificationTemplate?: string;
}
