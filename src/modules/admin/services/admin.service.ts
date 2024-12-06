import { BadRequestException, Injectable } from "@nestjs/common";
import { AdminEntity } from "../entities/admin.entity";
import { AdminRepository } from "../Repositories/admin.repository";
import { AdminDto } from "../dtos/admin.dto";
import { BcryptEncryptionService } from "@modules/encryption/services/bcrypt-encryption.service";
import { isContactNumber, isEmail } from "@src/utils/validators/email-contact.validator";
import { throwIfNotFound } from "@src/utils/exceptions/common.exception";

@Injectable()
export class AdminService{
    constructor(
        private readonly adminRepository:AdminRepository,
        private readonly bcryptEncryptionService:BcryptEncryptionService
    ){}

    async createAdmin(adminDto: AdminDto): Promise<AdminEntity> {
        const isAdminExistWithProvidedEmail = await this.getAdminByEmailIdOrThrow(
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

    async getAdminByEmailIdOrThrow(email:string):Promise<AdminEntity>{
        const admin = this.adminRepository
        .getRepository()
        .findOne({
            where:{ email }
        })
        // Use the helper function to handle the NotFoundException
        throwIfNotFound(admin, `No user exists with the provided email`);
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

    async getAdminByEmailOrContactNumber(username: string): Promise<AdminEntity | null> {
      const repository = this.adminRepository.getRepository();
  
      if (isEmail(username)) {
          return repository.findOne({ where: { email: username } });
      }
  
      if (isContactNumber(username)) {
          return repository.findOne({ where: { contactNumber: +username } });
      }
  
      throw new Error('Invalid username format');
    }

    async updatePassword(username: string, password: string) {
        const admin = await this.getAdminByEmailOrContactNumber(username);
    
        /// Use the helper function to handle the NotFoundException
        throwIfNotFound(admin, `No user exists with the provided ${username}`);
    
        const encryptedPassword =
          await this.bcryptEncryptionService.encrypt(password);
        admin.password = encryptedPassword;
        await this.adminRepository.getRepository().save(admin);
      }

}