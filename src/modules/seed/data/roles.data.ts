import { Injectable } from '@nestjs/common';
import { RoleRepository } from '@modules/authorization/repositories/role.repository';
import { UserTypeEnum } from '@src/utils/enums/user-type.enum';

@Injectable()
export class SeedRoleData {
  constructor(private readonly roleRepository: RoleRepository) {}

  async seedRoles(): Promise<void> {
    const queryRunner = this.roleRepository.getRepository().manager.connection.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
      await queryRunner.query('TRUNCATE TABLE roles;');
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');
      const roles = [
        {
          id: 21,
          name: 'OWNER',
          isSystemDefined: true,
          scope: UserTypeEnum.CLIENT,
          outletId: null,
        },
        {
          id: 22,
          name: 'MANAGER',
          isSystemDefined: true,
          scope: UserTypeEnum.CLIENT,
          outletId: null,
        },
        {
          id: 1,
          name: 'SUPER',
          isSystemDefined: true,
          scope: UserTypeEnum.ADMIN,
          outletId: null,
        },
        {
          id: 2,
          name: 'ADMIN',
          isSystemDefined: true,
          scope: UserTypeEnum.ADMIN,
          outletId: null,
        },
      ];

      await this.roleRepository.getRepository().save(roles);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
        await queryRunner.release();
      }
  }
}
