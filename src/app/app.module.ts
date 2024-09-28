import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@modules/database/database.module';
import { BusinessModule } from '@modules/business/business.module';
import { EnvModule } from '../modules/configs/env/env.module';
import { Throttler } from '../modules/configs/gaurds/rate-limiter.gaurd';
import { NotificationModule } from '@modules/notifications/notification.module';
import { AuthModule } from '@modules/auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from '@src/utils/exceptions/http-exception';
import { DatabaseExceptionFilter } from '@src/utils/exceptions/database-exception';
import { Logger } from 'winston';
import { Module } from '@nestjs/common';
import { AdminMOdule } from '@modules/admin/admin.module';
import { LibsModule } from '@modules/libs/libs.module';
import { CloudStorageModule } from '@modules/cloud-storage/cloud-storage.module';
import { BusinessServicesModule } from '@modules/business-services/business-service.module';
import { ClientModule } from '@modules/client/client.module';
import { AuthenticationGuard } from '@modules/auth/gaurds/authentication.gaurd';
import { CustomerModule } from '@modules/customer/customer.module';
import { CommonModule } from '@modules/common/common.module';
import { OrderModule } from '@modules/order/order.module';

@Module({
  imports: [
    Throttler,
    EnvModule,
    DatabaseModule,
    BusinessModule,
    NotificationModule,
    AuthModule,
    AdminMOdule,
    LibsModule,
    NotificationModule,
    CloudStorageModule,
    BusinessServicesModule,
    ClientModule,
    CustomerModule,
    CommonModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthorizationGuard,
    // },
  ],
})
export class AppModule {}
