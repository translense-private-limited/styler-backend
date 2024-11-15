import { AppConfigInterface } from './app.config';
import { NotificationConfigInterface } from './notification.config';
import { RateLimitterConfigInterface } from './rate-limitter.config';
export interface EnvConfigInterface {
  APP_CONFIG: AppConfigInterface;
  RATE_LIMITTER_CONFIG: RateLimitterConfigInterface;
  NOTIFICATION_CONFIG: NotificationConfigInterface;
}
