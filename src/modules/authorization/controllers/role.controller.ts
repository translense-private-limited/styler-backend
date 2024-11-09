import { Body, Controller, Get, Post } from '@nestjs/common';

import { RoleService } from '../services/role.service';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { RoleEntity } from '../entities/role.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('roles') // Global route
@ApiTags('authorization')
export class roleController {
  constructor(private readonly rolesService: RoleService) {}

  @Post() // POST /out
  async createRole(@Body() createRolesDto: CreateRoleDto): Promise<RoleEntity> {
    return this.rolesService.createRole(createRolesDto);
  }

  @Get() // GET /out
  async getAllRoles(): Promise<RoleEntity[]> {
    return this.rolesService.getAllRoles();
  }
}
