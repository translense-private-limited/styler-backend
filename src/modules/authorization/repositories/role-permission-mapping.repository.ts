// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { BaseRepository } from '@src/utils/repositories/base-repository';
// import { getMysqlDataSource } from '@modules/database/data-source';
// import { Repository } from 'typeorm';
// import { RolePermissionMapEntity } from '../entities/role-permission-map.entity';

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "@src/utils/repositories/base-repository";
import { RolePermissionMappingEntity } from "../entities/role-permission.mapping";
import { getMysqlDataSource } from "@modules/database/data-source";
import { In, Repository } from "typeorm";
import { ResourcePermissionDto } from "../dtos/resource-permission.dto";
import { RoleResourceIdDto } from "../dtos/role-resource-id.dto";
import { PermissionEnum } from "../enums/permission.enum";

// import { RolePermissions } from '@modules/client/dtos/role-with-permission.dto';

// @Injectable()
// export class RolePermissionMapRepository extends BaseRepository<RolePermissionMapEntity> {
//   constructor(
//     @InjectRepository(RolePermissionMapEntity, getMysqlDataSource())
//     private repository: Repository<RolePermissionMapEntity>,
//   ) {
//     super(repository);
//   }

//   async getRolePermissions(roleId: number): Promise<RolePermissions[]> {
//     const query = `
//     SELECT 
//     r.name, 
//     r.label, 
//     GROUP_CONCAT(rp.permission) AS permissions, 
//     rpm.roleId
// FROM 
//     role_permission_map rpm
// INNER JOIN 
//     resource_permission rp ON rp.resourcePermissionId = rpm.permissionId
// INNER JOIN 
//     resources r ON r.resourceId = rp.resourceId
// WHERE 
//     rpm.roleId = ?
// GROUP BY 
//     r.name, 
//     r.label, 
//     rpm.roleId;

//   `;

//     const queryResult = await this.repository.query(query, [roleId]);
//     return queryResult;
//   }

//   async createRolePermission(roleId: number, resourcePermissionIds: number[]) {
//     let rolePermissionMapEntities: RolePermissionMapEntity[] = [];

//     rolePermissionMapEntities = resourcePermissionIds.map(
//       (resourcePermissionId) => {
//         const rolePermissionMapEntity = new RolePermissionMapEntity();
//         rolePermissionMapEntity.permissionId = resourcePermissionId;
//         rolePermissionMapEntity.roleId = roleId;
//         return rolePermissionMapEntity;
//       },
//     );
//     await this.repository

//       .createQueryBuilder()
//       .insert()
//       .values(rolePermissionMapEntities)
//       .execute();
//   }
// }


@Injectable()
export class RolePermissionMappingRepository extends BaseRepository<RolePermissionMappingEntity> {
  constructor(
    @InjectRepository(RolePermissionMappingEntity, getMysqlDataSource())
    private repository: Repository<RolePermissionMappingEntity>,
  ) {
    super(repository);
  }

  async getRolePermissions(roleId: number): Promise<ResourcePermissionDto[]> {
    const roleResourceMapping = await this.repository.find({ where: { roleId } });

    // Return the mapped DTOs directly if there are any results, otherwise return an empty array
    return roleResourceMapping.length
      ? roleResourceMapping.map((resourcePermission) => ({
          resourceId: resourcePermission.resourceId,
          permissions: resourcePermission.permissions,
        } as ResourcePermissionDto))
      : [];
  }

  async getResourcePermissions(roleResourceId: RoleResourceIdDto): Promise<PermissionEnum[]> {
    const { roleId, resourceId } = roleResourceId;
  
    // Query for the specific roleId and resourceId
    const roleResourceMapping = await this.repository.findOne({ where: { roleId, resourceId } });
  
    // Return the permissions array if found, otherwise return an empty array
    return roleResourceMapping ? roleResourceMapping.permissions : [];
  }

   // Fetch all relevant mappings based on a single roleId and an array of resourceIds
   async findRoleResourceMappings(roleId: number, resourceIds: number[]): Promise<RolePermissionMappingEntity[]> {
    return await this.repository.find({
      where: {
        roleId,
        resourceId: In(resourceIds),
      },
    });
  }

   // Save updated mappings in bulk
   async saveUpdatedMappings(mappings: RolePermissionMappingEntity[]): Promise<void> {
    await this.repository.save(mappings);
  }
  
}
