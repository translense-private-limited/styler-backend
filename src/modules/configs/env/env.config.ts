import { AppConfig } from './app.config';
import { NotificationConfig } from './notification.config';
import { RateLimitterConfig } from './rate-limitter.config';
export interface EnvConfig {
  APP_CONFIG: AppConfig;
  RATE_LIMITTER_CONFIG: RateLimitterConfig;
  NOTIFICATION_CONFIG: NotificationConfig;
}
