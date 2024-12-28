import { Injectable } from '@nestjs/common';
import { AdminEntity } from '../entities/admin.entity';
import { AdminService } from './admin.service';
import { AdminSignupDto } from '@modules/authentication/dtos/admin-signup.dto';

@Injectable()
export class AdminExternalService {
  constructor(private readonly adminService: AdminService) {}

  async getAdminByEmailIdOrThrow(email: string): Promise<AdminEntity> {
    return await this.adminService.getAdminByEmailIdOrThrow(email);
  }

  async getAdminByContactNumber(contactNumber: number): Promise<AdminEntity> {
    return await this.adminService.getAdminByContactNumber(contactNumber);
  }

  async save(adminSignUpDto: AdminSignupDto): Promise<AdminEntity> {
    return this.adminService.createAdmin(adminSignUpDto);
  }

  async getAdminByEmailOrContactNumber(username: string): Promise<AdminEntity> {
    return this.adminService.getAdminByEmailOrContactNumber(username);
  }

  async updatePassword(username: string, password: string): Promise<void> {
    await this.adminService.updatePassword(username, password);
  }
}
