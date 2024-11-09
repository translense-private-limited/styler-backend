import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { RoleInterface } from '../interfaces/role.interface';

export class CreateRoleDto implements RoleInterface {
  @IsNotEmpty()
  @IsString()
  name: string; // Required field

  @IsBoolean()
  @IsOptional()
  isSystemDefined: boolean; // Required field

  @IsNotEmpty()
  @IsNumber()
  outletId: number; // Required field
}
