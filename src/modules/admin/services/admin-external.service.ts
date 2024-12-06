import { Injectable } from "@nestjs/common";
import { AdminDto } from "../dtos/admin.dto";
import { AdminEntity } from "../entities/admin.entity";
import { AdminService } from "./admin.service";

@Injectable()
export class AdminExternalService{
    constructor(private readonly adminService:AdminService){}

     async getAdminByEmailIdOrThrow(email: string): Promise<AdminEntity> {
        return await this.adminService.getAdminByEmailIdOrThrow(email);
    }

    async getAdminByContactNumber(contactNumber:number):Promise<AdminEntity>{
        return await this.adminService.getAdminByContactNumber(contactNumber);
    }

    async save(adminDto:AdminDto):Promise<AdminEntity>{
        return this.adminService.createAdmin(adminDto);
    }

    async getAdminByEmailOrContactNumber(username:string):Promise<AdminEntity>{
        return this.adminService.getAdminByEmailOrContactNumber(username);
    }

    async updatePassword(username: string, password: string) {
        await this.adminService.updatePassword(username, password);
      }

}