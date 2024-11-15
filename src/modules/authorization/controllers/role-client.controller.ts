import { Controller, Get, Param } from '@nestjs/common';
import { RoleClientService } from '../services/role-client.service';
import { RoleEntity } from '../entities/role.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SystemAndCustomRolesDto } from '../dtos/system-custom-roles.dto';
import { Public } from '@src/utils/decorators/public.decorator';

@Controller('client')
@ApiTags('Client/Role')
export class RoleClientController {
  constructor(private readonly roleClientService: RoleClientService) {}

  @ApiBearerAuth('jwt')
  @Get('roles/system-defined')
  @ApiOperation({
    description: 'Get all system defined roles',
  })
  async getAllSystemDefinedRoles(): Promise<RoleEntity[]> {
    return this.roleClientService.getAllSystemDefinedRoles();
  }

  @ApiBearerAuth('jwt')
  @Get('role/custom/:outletId')
  async getAllCustomRoles(
    @Param('outletId') outletId: number,
  ): Promise<RoleEntity[]> {
    return this.roleClientService.getAllCustomRoles(outletId);
  }

  @ApiBearerAuth('jwt')
  @Get('role/:outletId')
  async getAllRoles(
    @Param('outletId') outletId: number,
  ): Promise<SystemAndCustomRolesDto> {
    return this.roleClientService.getAllRoles(outletId);
  }
}
