import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';
import { PlatformEnum } from '../enums/platform.enum';
import { UserTypeEnum } from '@modules/authorization/enums/usertype.enum';

export class RegisterDeviceTokenDto {
  @IsString()
  @IsNotEmpty()
  deviceToken: string;

  @IsNotEmpty()
  platform: PlatformEnum;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  userType: UserTypeEnum;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
