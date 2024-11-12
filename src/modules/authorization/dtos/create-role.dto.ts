import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { RoleInterface } from '../interfaces/role.interface';
import { UserType } from '../enums/usertype.enum';

export class CreateRoleDto implements RoleInterface {
  @IsNotEmpty()
  @IsString()
  name: string; // Required field

  @IsBoolean()
  @IsOptional()
  isSystemDefined: boolean; // Required field

  @IsNotEmpty()
  scope: UserType;
  
  @IsNotEmpty()
  @IsNumber()
  outletId: number; // Required field
}
