import { Injectable } from '@nestjs/common';
import { RoleRepository } from '@modules/authorization/repositories/role.repository';
import { UserTypeEnum } from '@modules/authorization/enums/usertype.enum';

@Injectable()
export class RoleData {
  constructor(private readonly roleRepository: RoleRepository) {}

  async seedRoles(): Promise<void> {
    try {
      const roles = [
        {
          id: 21,
          name: 'owner',
          isSystemDefined: true,
          scope: UserTypeEnum.CLIENT,
          outletId: null,
        },
        {
          id: 22,
          name: 'manager',
          isSystemDefined: true,
          scope: UserTypeEnum.CLIENT,
          outletId: null,
        },
      ];

      await this.roleRepository.getRepository().save(roles);
      console.log('Roles table seeding completed.');
    } catch (error) {
      console.error('Error during roles table seeding:', error);
      throw error;
    }
  }
}
