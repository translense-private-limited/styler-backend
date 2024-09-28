// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { ResourceEnum } from '../enums/resource-enum';
import { PermissionEnum } from '@modules/auth/enums/permission.enum';

export const REQUIRED_PERMISSION = 'required_permission';

type PermissionDto = {
  [key in ResourceEnum]: PermissionEnum[];
};

export const Roles = (permissions: PermissionDto[]) =>
  SetMetadata(REQUIRED_PERMISSION, permissions);
