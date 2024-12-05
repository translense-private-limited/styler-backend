import { AdminDto } from "@modules/admin/dtos/admin.dto";

export interface AdminLoginResponseInterface {
    admin: Omit<AdminDto, 'password'>;
    token: string;
  }