import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ResourcePermissionDto } from './resource-permission.dto';



export class RolePermissionMappingDto {
  @IsNumber()
  roleId: number;

  @IsArray()
  @ValidateNested()
  @Type(() => ResourcePermissionDto)
  resourcePermission: ResourcePermissionDto[];
}
