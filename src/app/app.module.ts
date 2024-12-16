import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@modules/database/database.module';

import { EnvModule } from '../modules/configs/env/env.module';
import { Throttler } from '../modules/configs/gaurds/rate-limiter.gaurd';

import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from '@src/utils/exceptions/http-exception';
import { DatabaseExceptionFilter } from '@src/utils/exceptions/database-exception';
import { Logger } from 'winston';
import { MiddlewareConsumer, Module } from '@nestjs/common';

import { ResponseTransformInterceptor } from '@src/utils/interceptors/response.interceptor';
import { RequestIdMiddleware } from '@src/utils/middlewares/request.middleware';
import { GlobalExceptionFilter } from '@src/utils/exceptions/global-exception';
import { ClientModule } from '@modules/client/client.module';
import { AuthenticationModule } from '@modules/authentication/atuhentication.module';

import { AuthenticationGuard } from '@modules/authentication/gaurds/authentication.gaurd';
import { ServiceModule } from '@modules/client/services/service.module';
import { AuthorizationModule } from '@modules/authorization/authorization.module';

import { OutletGuard } from '@modules/authorization/gaurds/outlet-gaurd';
import { AdminModule } from '@modules/admin/admin.module';
import * as mongoose from 'mongoose';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { CustomerModule } from '@modules/customer/customer.module';
import { SeedModule } from '@modules/seed/seed.module';

@Module({
  imports: [
    ClientModule,
    Throttler,
    EnvModule,
    DatabaseModule,
    AuthenticationModule,
    ServiceModule,
    AuthorizationModule,
    AdminModule,
    CustomerModule,
    SeedModule,
  ],
  controllers: [AppController, ImageController],
  providers: [
    ImageService,
    AppService,
    Logger,

    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },

    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: OutletGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthorizationGuard,
    // },
  ],
})
export class AppModule {
  constructor() {
    // Enable Mongoose debug logging
    mongoose.set('debug', false);
  }
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestIdMiddleware) // Apply your middleware here
      .forRoutes('*'); // Apply to all routes
  }
}
