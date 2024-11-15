import { join } from 'path';
import { readFileSync } from 'fs';
import { EnvConfigInterface } from './env.config';
import { ConfigFactory, registerAs } from '@nestjs/config';
import { AppConfigInterface } from './app.config';
import { EnvNamespaceEnum } from './enums/env-namespace.enum';
import { RateLimitterConfigInterface } from './rate-limitter.config';
import { NotificationConfigInterface } from './notification.config';

export function loadConfigFile(): EnvConfigInterface {
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
  ConfigFactory<AppConfigInterface>,
  ConfigFactory<RateLimitterConfigInterface>,
  ConfigFactory<NotificationConfigInterface>,
] => {
  const envVariables = loadConfigFile();
  const appConfig = registerAs<AppConfigInterface>(
    EnvNamespaceEnum.APP_CONFIG,
    () => envVariables.APP_CONFIG,
  );
  const rateLimiterConfig = registerAs<RateLimitterConfigInterface>(
    EnvNamespaceEnum.RATE_LIMITTER_CONFIG,
    () => envVariables.RATE_LIMITTER_CONFIG,
  );

  const notificationConfig = registerAs<NotificationConfigInterface>(
    EnvNamespaceEnum.NOTIFICATION_CONFIG,
    () => envVariables.NOTIFICATION_CONFIG,
  );
  return [appConfig, rateLimiterConfig, notificationConfig];
};
