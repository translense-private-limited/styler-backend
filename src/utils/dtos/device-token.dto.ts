import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';
import { ApplicationPlatformEnum } from '../enums/application-platform.enum';

import { DeviceTokenInterface } from '../interfaces/device-token.interface';
import { UserTypeEnum } from '@modules/authorization/enums/user-type.enum';

export class DeviceTokenDto implements DeviceTokenInterface{
  @IsString()
  @IsNotEmpty()
  deviceToken: string;

  @IsNotEmpty()
  platform: ApplicationPlatformEnum;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  userType: UserTypeEnum;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
