import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';
import { ApplicationPlatformEnum } from '../enums/application-platform.enum';
import { UserTypeEnum } from '@modules/authorization/enums/usertype.enum';

export class DeviceTokenDto {
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
