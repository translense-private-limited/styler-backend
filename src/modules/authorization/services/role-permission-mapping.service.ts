import { Injectable } from '@nestjs/common';
import { RolePermissionMappingDto } from '../dtos/role-permission-mapping.dto';
import { RolePermissionMappingEntity } from '../entities/role-permission.mapping';
import { RolePermissionMappingRepository } from '../repositories/role-permission-mapping.repository';

@Injectable()
export class RolePermissionService {
  constructor(
    private readonly rolePermissionMappingRepository: RolePermissionMappingRepository,
  ) {}

  // Main function to update role permissions based on incoming data

  async updateRolePermissions(
    rolePermissionMappingDto: RolePermissionMappingDto,
  ): Promise<void> {
    const roleId = rolePermissionMappingDto.roleId; // Extract roleId
    const resourcePermissions = rolePermissionMappingDto.resourcePermission; // Array of ResourcePermissionDto

    // Step 1: Extract resourceIds from the incoming resourcePermissions
    const resourceIds = resourcePermissions.map(
      (resource) => resource.resourceId,
    );

    // Step 2: Fetch existing mappings for the specified roleId and resourceIds in a single query
    const existingMappings =
      await this.rolePermissionMappingRepository.findRoleResourceMappings(
        roleId,
        resourceIds,
      );

    // Step 3: Create an object to store existing mappings by resourceId for quick lookup
    const existingMappingMap = Object.fromEntries(
      existingMappings.map((mapping) => [mapping.resourceId, mapping]),
    );

    // Step 4: Prepare an array for new mappings
    const newMappings: RolePermissionMappingEntity[] = [];

    // Step 5: Iterate over incoming resource permissions
    for (const resourcePermission of resourcePermissions) {
      const { resourceId, permissions } = resourcePermission; // Extract resourceId and permissions

      if (existingMappingMap[resourceId]) {
        // If mapping exists, update permissions
        existingMappingMap[resourceId].permissions = permissions; // Update permissions
      } else {
        // If mapping does not exist, create a new one
        const newMapping = new RolePermissionMappingEntity();
        newMapping.roleId = roleId; // Set the roleId
        newMapping.resourceId = resourceId; // Set the resourceId
        newMapping.permissions = permissions; // Set the permissions
        newMappings.push(newMapping); // Add new mapping to the array
      }
    }

    // Step 6: Combine existing updated mappings with new mappings for bulk save
    const updatedMappings =
      Object.values(existingMappingMap).concat(newMappings);

    // Step 7: Save all updated and new mappings in one go
    if (updatedMappings.length > 0) {
      await this.rolePermissionMappingRepository
        .getRepository()
        .save(updatedMappings);
    }
  }
}
