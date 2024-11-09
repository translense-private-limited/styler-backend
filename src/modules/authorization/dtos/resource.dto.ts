import { UserEnum } from '@modules/atuhentication/enums/user.enum';
import { IsEnum, IsString } from 'class-validator';

export class ResourceDto {
  @IsString()
  name: string;
  @IsString()
  label: string;
  @IsEnum(UserEnum)
  user: UserEnum;
}
