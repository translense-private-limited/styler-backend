import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventConfigurationEntity } from './entities/even-configuration.entity';
import { getMysqlDataSource } from '@modules/database/data-source';
import { ClientModule } from '@modules/client/client.module';
import { EventConfigurationRepository } from './repositories/event-configuration.repository';
import { EventConfigurationService } from './services/event-configuration.service';
import { NotificationTest } from './controllers/notification-test.controller';
import { EventConsumerService } from './services/event.consumer.service';
import { NotificationBuilderService } from './services/notification-builder.service';
import { EmailBuilderService } from './services/email-builder.service';
import { CustomerModule } from '@modules/customer/customer.module';
import { EmailService } from './services/email.service';
import { EnvModule } from '@modules/configs/env/env.module';
import { SmsService } from './services/sms.service';
import { SmsBuilderService } from './services/sms-builder.service';
import { SinchSmsService } from './services/sinch-sms-service';
import { EventPublisherService } from './services/event-publisher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventConfigurationEntity], getMysqlDataSource()),
    ClientModule,
    CustomerModule,
    EnvModule,
  ],
  providers: [
    EventConfigurationRepository,
    EventConfigurationService,
    EventConsumerService,
    NotificationBuilderService,
    EmailBuilderService,
    EmailService,
    SmsService,
    SmsBuilderService,
    SinchSmsService,
    EventPublisherService,
  ],
  controllers: [NotificationTest],
  exports:[EventConfigurationRepository]
})
export class NotificationModule {}
