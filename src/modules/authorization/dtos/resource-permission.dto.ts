import { IsArray, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PermissionEnum } from '../enums/permission.enum';

export class ResourcePermissionDto {
  @IsArray()
  @IsEnum(PermissionEnum, { each: true })
  permissions: PermissionEnum[];

  @IsNumber()
  resourceId: number
}


