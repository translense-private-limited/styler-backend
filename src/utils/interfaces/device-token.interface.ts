import { UserTypeEnum } from '@src/utils/enums/user-type.enum';
import { ApplicationPlatformEnum } from '../enums/application-platform.enum';

export interface DeviceTokenInterface {
  deviceToken: string;
  platform: ApplicationPlatformEnum;
  userId: number;
  userType: UserTypeEnum;
  isActive: boolean;
}
