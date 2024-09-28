import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { setupConfig } from './setup.config';
import { EnvService } from './services/env.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: setupConfig(),
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
