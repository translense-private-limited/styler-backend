import { Body, Controller } from '@nestjs/common';
import { RolePermissionMappingDto } from '../dtos/role-permission-mapping.dto';

@Controller()
export class RolePermissionMappingController {
  constructor() {}

  async upsertRolePermission(
    @Body() rolePermissionMappingDto: RolePermissionMappingDto,
  ): Promise<void> {
    console.log(rolePermissionMappingDto);
    return;
  }
}
