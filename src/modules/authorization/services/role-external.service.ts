import { Injectable } from '@nestjs/common';
import { RoleEntity } from '../entities/role.entity';
import { RoleRepository } from '../repositories/role.repository';
import { RoleService } from './role.service';

@Injectable()
export class RoleExternalService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private roleService: RoleService,
  ) {}

  async getRoleDetails(roleName: string): Promise<RoleEntity> {
    const role = await this.roleRepository
      .getRepository()
      .findOne({ where: { name: roleName } });
    return role;
  }

  async getRoleByIdOrThrow(roleId: number): Promise<RoleEntity> {
    const role = await this.roleService.getRoleByIdOrThrow(roleId);
    return role;
  }
}
