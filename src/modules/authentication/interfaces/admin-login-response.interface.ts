import { AdminWithRoleDtoInterface } from './admin-with-role.interface';

export interface AdminLoginResponseInterface {
  admin: AdminWithRoleDtoInterface;
  token: string;
}
