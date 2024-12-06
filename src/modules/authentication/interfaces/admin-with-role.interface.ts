import { AdminInterface } from '@modules/admin/interfaces/admin.interface';
import { RoleEntity } from '@modules/authorization/entities/role.entity';

export interface AdminWithRoleDtoInterface
  extends Omit<AdminInterface, 'roleId' | 'password'> {
  adminId: number;
  name: string;
  contactNumber: number;
  email: string;

  role: RoleEntity;
}
