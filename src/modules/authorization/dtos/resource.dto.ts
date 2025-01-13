import { UserTypeEnum } from "../../../utils/enums/user-type.enum";
import { IsEnum, IsString } from 'class-validator';

export class ResourceDto {
  @IsString()
  name: string;
  @IsString()
  label: string;
  @IsEnum(UserTypeEnum)
  user: UserTypeEnum;
}
