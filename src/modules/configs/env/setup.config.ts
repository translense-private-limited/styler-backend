import { join } from 'path';
import { readFileSync } from 'fs';
import { EnvConfig } from './env.config';
import { ConfigFactory, registerAs } from '@nestjs/config';
import { AppConfig } from './app.config';
import { EnvNamespace } from './enums/env-namespace.enum';
import { RateLimitterConfig } from './rate-limitter.config';
import { NotificationConfig } from './notification.config';

export function loadConfigFile(): EnvConfig {
  const ENVIRONMENT: string = process.env.ENVIRONMENT || 'development';
  const envFilePath = join(
    'src',
    'modules',
    'configs',
    'env',
    `.env.${ENVIRONMENT}.json`,
  );
  return JSON.parse(readFileSync(envFilePath, 'utf-8'));
}

export const setupConfig = (): [
  ConfigFactory<AppConfig>,
  ConfigFactory<RateLimitterConfig>,
  ConfigFactory<NotificationConfig>,
] => {
  const envVariables = loadConfigFile();
  const appConfig = registerAs<AppConfig>(
    EnvNamespace.APP_CONFIG,
    () => envVariables.APP_CONFIG,
  );
  const rateLimiterConfig = registerAs<RateLimitterConfig>(
    EnvNamespace.RATE_LIMITTER_CONFIG,
    () => envVariables.RATE_LIMITTER_CONFIG,
  );

  const notificationConfig = registerAs<NotificationConfig>(
    EnvNamespace.NOTIFICATION_CONFIG,
    () => envVariables.NOTIFICATION_CONFIG,
  );
  return [appConfig, rateLimiterConfig, notificationConfig];
};
