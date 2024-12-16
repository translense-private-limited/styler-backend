import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerModule,
} from '@nestjs/throttler';
import { loadConfigFile } from '../env/setup.config';

class CustomThrottler extends ThrottlerGuard {
  protected throwThrottlingException(): Promise<void> {
    const { RATE_LIMITTER_CONFIG } = loadConfigFile();
    throw new ThrottlerException(
      `Throttler limit ${RATE_LIMITTER_CONFIG.limit} per ${RATE_LIMITTER_CONFIG.ttl} milliseconds`,
    );
  }
}

function setUpThrottler(): DynamicModule[] {
  const { RATE_LIMITTER_CONFIG } = loadConfigFile();
  return [
    ThrottlerModule.forRoot([
      {
        ttl: RATE_LIMITTER_CONFIG.ttl,
        limit: RATE_LIMITTER_CONFIG.limit,
      },
    ]),
  ];
}

@Module({
  imports: [...setUpThrottler()],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottler,
    },
  ],
})
export class Throttler {}
