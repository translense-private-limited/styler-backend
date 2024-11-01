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
import { AuthenticationModule } from '@modules/atuhentication/atuhentication.module';

import { AuthenticationGuard } from '@modules/atuhentication/gaurds/authentication.gaurd';
import { ServiceModule } from '@modules/services/service.module';
import { AuthorizationModule } from '@modules/authorization/authorization.module';

import { AdminModule } from '@modules/admin/category/admin.module';
import { OutletGuard } from '@modules/authorization/gaurds/outlet-gaurd';

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
      useClass: GlobalExceptionFilter,
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
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware) // Apply your middleware here
      .forRoutes('*'); // Apply to all routes
  }
}
