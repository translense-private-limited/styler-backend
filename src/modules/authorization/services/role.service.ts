// import {
//   BadRequestException,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';



// import { RoleRepository } from '../repositories/role.repository';
// import { ResourcePermissionRepository } from '../repositories/resource-permission.repository';
// import { PermissionEnum } from '../enums/permission.enum';

// import { In } from 'typeorm';


// import { RolePermissionMapRepository } from '../repositories/role-permission-map.repository';


// @Injectable()
// export class RoleService {
//   constructor(
//     private roleRepository: RoleRepository,
//     private resourcePermissionRepository: ResourcePermissionRepository,

//     private rolePermissionMapRepository: RolePermissionMapRepository,

//   ) {}

//   async createClientRole(
//     createRoleDto: CreateClientRoleDto,
//   ): Promise<RoleEntity> {
//     const roleEntity = new RoleEntity();

//     const business = await this.businessService.getBusinessByIdOrThrow(
//       createRoleDto.businessId,
//     );
//     const whitelabel = await this.whitelabelService.getWhitelabelByIdOrThrow(
//       createRoleDto.whitelabelId,
//     );

//     Object.assign(roleEntity, createRoleDto, { business, whitelabel });
//     return await this.roleRepository.getRepository().save(roleEntity);
//   }

//   private async getOrCreatePermissionByResourceId(
//     resourceId: number,
//     permission: PermissionEnum,
//   ): Promise<ResourcePermissionEntity> {
//     const resourcePermissions = await this.resourcePermissionRepository
//       .getRepository()
//       .find({ where: { resourceId } });
//     const resourcePermission = resourcePermissions.find(
//       (resourcePermission) => resourcePermission.permission === permission,
//     );
//     if (!resourcePermission) {
//       const permissionDto = new PermissionDto();
//       permissionDto.resourceId = resourceId;
//       permissionDto.permission = permission;
//       const resourcePermission = await this.resourcePermissionRepository
//         .getRepository()
//         .save(permissionDto);
//       return resourcePermission;
//     }
//     return resourcePermission;
//   }

//   private async getPermissions(
//     resourcePermissions: ResourcePermissionDto[],
//   ): Promise<ResourcePermissionEntity[]> {
//     const permissionsPromise = resourcePermissions.map((resourcePermission) => {
//       return this.getOrCreatePermissionByResourceId(
//         resourcePermission.resourceId,
//         resourcePermission.permission,
//       );
//     });
//     const permissions = await Promise.all(permissionsPromise);
//     return permissions;
//   }
//   async createSystemDefinedRole(
//     createRoleDto: CreateSystemDefinedRoleDto,
//   ): Promise<RoleEntity> {
//     const { resourcePermission } = createRoleDto;
//     await this.getPermissions(resourcePermission);

//     const roleEntity = new RoleEntity();
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { resourcePermission: exclude, ...rest } = createRoleDto;
//     Object.assign(roleEntity, rest);

//     return await this.roleRepository.getRepository().save(roleEntity);
//   }

//   async createSuperAdminRole(): Promise<RoleEntity> {
//     const roleEntity = new RoleEntity();
//     roleEntity.description = 'Super Admin for entire application';
//     roleEntity.isSystemDefined = true;
//     roleEntity.label = 'Super';
//     roleEntity.name = RoleEnum.SUPER;
//     roleEntity.roleId = 1;
//     roleEntity.userType = UserTypeEnum.ADMIN;
//     const whitelabel = await this.whitelabelService.getWhitelabelByIdOrThrow(
//       WhitelabelEnum.STYLER,
//     );
//     roleEntity.whitelabel = whitelabel;
//     return await this.roleRepository.getRepository().save(roleEntity);
//   }

//   async createOwnerRole(): Promise<RoleEntity> {
//     const ownerRoleDto = new RoleEntity();
//     ownerRoleDto.description = 'Owner of a business ';
//     ownerRoleDto.isSystemDefined = true;
//     ownerRoleDto.label = 'Owner';
//     ownerRoleDto.name = RoleEnum.OWNER;
//     ownerRoleDto.roleId = RoleIdMapEnum.OWNER;
//     ownerRoleDto.userType = UserTypeEnum.CLIENT;
//     ownerRoleDto.whitelabel =
//       await this.whitelabelService.getWhitelabelByIdOrThrow(
//         WhitelabelEnum.STYLER,
//       );
//     return await this.roleRepository.getRepository().save(ownerRoleDto);
//   }

//   async getRoleDetailWithPermissionByRoleId(
//     roleId: number,
//   ): Promise<RoleWithPermissionDto> {
//     const role = await this.getRoleByIdOrThrow(roleId);
//     const permissions = await this.getRolePermissions(roleId);
//     return {
//       role,
//       permissions,
//     };
//   }

//   async getRoleByIdOrThrow(roleId: number): Promise<RoleEntity> {
//     const role = await this.roleRepository
//       .getRepository()
//       .findOne({ where: { roleId } });
//     if (!role) {
//       throw new BadRequestException(`role doesnot exist with provided id `);
//     }
//     return role;
//   }
//   async getRoleById(roleId: number): Promise<RoleEntity> {
//     const role = await this.roleRepository
//       .getRepository()
//       .findOne({ where: { roleId } });
//     return role;
//   }

//   async getAllBusinessRoles(
//     whitelabelId: number,
//     businessId: number,
//   ): Promise<RoleEntity[]> {
//     const roles = await this.roleRepository.getRepository().find({
//       where: [
//         {
//           whitelabel: { whitelabelId },
//           business: { businessId },
//           isSystemDefined: false,
//           userType: UserTypeEnum.CLIENT,
//         },
//         {
//           whitelabel: { whitelabelId },
//           business: null,
//           isSystemDefined: true,
//           userType: UserTypeEnum.CLIENT,
//         },
//       ],
//     });
//     return roles;
//   }

//   async getAllCustomBusinessRole(
//     whitelabelId: number,
//     businessId: number,
//   ): Promise<RoleEntity[]> {
//     const roles = await this.roleRepository.getRepository().find({
//       where: {
//         whitelabel: {
//           whitelabelId,
//         },
//         business: {
//           businessId,
//         },
//         userType: UserTypeEnum.CLIENT,
//         isSystemDefined: false,
//       },
//     });
//     return roles;
//   }

//   async getAllSystemDefinedBusinessRole(
//     whitelabelId: number,
//   ): Promise<RoleEntity[]> {
//     const roles = await this.roleRepository.getRepository().find({
//       where: {
//         whitelabel: {
//           whitelabelId,
//         },
//         userType: UserTypeEnum.CLIENT,
//         isSystemDefined: true,
//       },
//     });
//     return roles;
//   }

//   async getAllSystemDefinedRoles(whitelabelId: number): Promise<RoleEntity[]> {
//     const roles = await this.roleRepository.getRepository().find({
//       where: {
//         whitelabel: { whitelabelId },
//         isSystemDefined: true,
//       },
//     });
//     return roles;
//   }

//   async getAllAdminRoles(): Promise<RoleEntity[]> {
//     const roles = await this.roleRepository.getRepository().find({
//       where: {
//         userType: UserTypeEnum.ADMIN,
//       },
//     });
//     return roles;
//   }

//   async getSuperAdmin(): Promise<RoleEntity> {
//     const superAdmin = await this.roleRepository.getRepository().findOne({
//       where: {
//         name: RoleEnum.SUPER,
//       },
//     });
//     return superAdmin;
//   }

//   async getOwner(): Promise<RoleEntity> {
//     const superAdmin = await this.roleRepository.getRepository().findOne({
//       where: {
//         name: RoleEnum.OWNER,
//       },
//     });
//     return superAdmin;
//   }

//   async getSystemDefinedRoleByName(roles: RoleEnum[]): Promise<RoleEntity[]> {
//     return await this.roleRepository.getRepository().find({
//       where: {
//         name: In(roles),
//         isSystemDefined: true,
//       },
//     });
//   }

//   async getBusinessRoleByIdOrThrow(
//     roleId: number,
//     clientIdentityDto: ClientIdentityDto,
//   ): Promise<RoleEntity> {
//     const role = await this.roleRepository.getRepository().findOne({
//       where: [
//         {
//           business: { businessId: clientIdentityDto.businessId },
//           whitelabel: { whitelabelId: clientIdentityDto.whitelabelId },
//           roleId,
//           isSystemDefined: false,
//           userType: UserTypeEnum.CLIENT,
//         },
//         {
//           isSystemDefined: true,
//           whitelabel: { whitelabelId: clientIdentityDto.whitelabelId },
//           roleId,
//           userType: UserTypeEnum.CLIENT,
//         },
//       ],
//     });
//     if (!role) {
//       throw new BadRequestException('Invalid role');
//     }
//     return role;
//   }

//   async getRolePermissions(roleId: number): Promise<RolePermissions[]> {
//     const role = await this.getRoleByIdOrThrow(roleId);
//     const permissions =
//       await this.rolePermissionMapRepository.getRolePermissions(role.roleId);
//     return permissions;
//   }

//   async updateRolePermissions(
//     roleId: number,
//     resourcePermission: ResourcePermissionDto[],
//   ): Promise<RolePermissions[]> {
//     await this.getRoleByIdOrThrow(roleId);

//     await this.rolePermissionMapRepository.getRepository().delete({ roleId });

//     const resourcePermissions =
//       await this.resourcePermissionRepository.getOrCreateResourcePermission(
//         resourcePermission,
//       );
//     const resourcePermissionIds = resourcePermissions.map(
//       (resourcePermission) => resourcePermission.resourcePermissionId,
//     );

//     await this.rolePermissionMapRepository.createRolePermission(
//       roleId,
//       resourcePermissionIds,
//     );

//     const updatedPermissions =
//       await this.rolePermissionMapRepository.getRolePermissions(roleId);

//     return updatedPermissions;
//   }

//   async deleteRole(roleId: number): Promise<string> {
//     const role = await this.getRoleByIdOrThrow(roleId);
//     if (role.isSystemDefined) {
//       throw new UnauthorizedException(
//         'You cannot delete the system defined role ',
//       );
//     }
//     const result = await this.roleRepository.getRepository().delete({ roleId });
//     if (result.affected === 1) {
//       return `Role deleted successfully`;
//     } else {
//       return `something went wrong `;
//     }
//   }

//   async updateRole(
//     roleId: number,
//     roleDto: Partial<RoleDto>,
//   ): Promise<RoleEntity> {
//     const role = await this.getRoleByIdOrThrow(roleId);
//     Object.assign(role, roleDto);
//     const updatedRole = await this.roleRepository.getRepository().save(role);
//     return updatedRole;
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleEntity } from '../entities/role.entity';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { RoleRepository } from '../repositories/role.repository';


@Injectable()
export class RoleService {
    constructor(private readonly rolesRepository: RoleRepository) { }

    // Create a new roles
    async createRole(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
        return await this.rolesRepository.getRepository().save(createRoleDto);
    }

    // Fetch all roles
    async getAllRoles(): Promise<RoleEntity[]> {
        return this.rolesRepository.getRepository().find();
    }

}