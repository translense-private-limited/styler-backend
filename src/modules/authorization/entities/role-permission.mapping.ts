import { BaseEntity } from '@src/utils/entities/base.entity';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionEnum } from '../enums/permission.enum';

@Entity('rolePermissionMapping')
export class RolePermissionMappingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  resourceId: number;

  roleId: number;

  permissions: PermissionEnum[];
}
