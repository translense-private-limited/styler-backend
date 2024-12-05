import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AdminEntity } from "../entities/admin.entity";
import { AdminRepository } from "../Repositories/admin.repository";
import { AdminDto } from "../dtos/admin.dto";
import { BcryptEncryptionService } from "@modules/encryption/services/bcrypt-encryption.service";

@Injectable()
export class AdminService{
    constructor(
        private readonly adminRepository:AdminRepository,
        private readonly bcryptEncryptionService:BcryptEncryptionService
    ){}

    async createAdmin(adminDto: AdminDto): Promise<AdminEntity> {
        const isAdminExistWithProvidedEmail = await this.getAdminByEmailId(
          adminDto.email,
        );
        const isAdminExistWithContactNumber =
          await this.getAdminByContactNumber(adminDto.contactNumber);
    
        if (isAdminExistWithContactNumber || isAdminExistWithProvidedEmail) {
          throw new BadRequestException(`User already exits with provided details`);
        }
    
        const encryptedPassword = await this.bcryptEncryptionService.encrypt(
          adminDto.password,
        );
    
        adminDto.password = encryptedPassword;
    
        return this.adminRepository.getRepository().save(adminDto);
    }

    async getAdminByEmailId(email:string):Promise<AdminEntity>{
        const admin = this.adminRepository
        .getRepository()
        .findOne({
            where:{ email }
        })
        if(!admin){
            throw new NotFoundException('No user exists with the provided email');
        }
        return admin;
    }

    async getAdminByContactNumber(
        contactNumber: number,
      ): Promise<AdminEntity> {
        const admin = await this.adminRepository
          .getRepository()
          .findOne({ where: { contactNumber }
         });
        return admin;
    }

    async getAdminByEmailOrContactNumber(
        username: string,
      ): Promise<AdminEntity | null> {
        // If it's an email, query by email, if it's a contact number, query by contactNumber
        if (this.isEmail(username)) {
          return this.adminRepository.getRepository().findOne({
            where: { email: username },
          });
        } else if (this.isContactNumber(username)) {
          return this.adminRepository.getRepository().findOne({
            where: { contactNumber: +username },
          });
        } else {
          // If it's neither a valid email nor a contact number
          throw new Error('Invalid username format');
        }
    }

    private isEmail(username: string): boolean {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(username);
    }

    private isContactNumber(username: string): boolean {
        const contactNumberPattern = /^\d{10}$/;
        return contactNumberPattern.test(username);
    }

    async updatePassword(username: string, password: string) {
        const admin = await this.getAdminByEmailOrContactNumber(username);
    
        // Throw an error if the admin does not exist
        if (!admin) {
          throw new NotFoundException(
            `No registered customer found with the provided username: ${username}`,
          );
        }
    
        const encryptedPassword =
          await this.bcryptEncryptionService.encrypt(password);
        admin.password = encryptedPassword;
        await this.adminRepository.getRepository().save(admin);
      }

}