// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';


export const REQUIRED_PERMISSION = 'required_permission';

// type PermissionDto = {
//   [key in ResourceEnum]: PermissionEnum[];
// };

// export const Roles = (permissions: PermissionDto[]) =>
//   SetMetadata(REQUIRED_PERMISSION, permissions);