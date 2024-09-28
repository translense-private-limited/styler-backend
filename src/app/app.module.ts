import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@modules/database/database.module';

import { EnvModule } from '../modules/configs/env/env.module';
import { Throttler } from '../modules/configs/gaurds/rate-limiter.gaurd';

import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from '@src/utils/exceptions/http-exception';
import { DatabaseExceptionFilter } from '@src/utils/exceptions/database-exception';
import { Logger } from 'winston';
import { Module } from '@nestjs/common';




@Module({
  imports: [
    Throttler,
    EnvModule,
    DatabaseModule,
    
   
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
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthenticationGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthorizationGuard,
    // },
  ],
})
export class AppModule {}
