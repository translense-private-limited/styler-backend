import { BadRequestException, Injectable } from '@nestjs/common';
import { AdminEntity } from '../entities/admin.entity';
import { AdminRepository } from '../Repositories/admin.repository';
import { AdminDto } from '../dtos/admin.dto';
import { BcryptEncryptionService } from '@modules/encryption/services/bcrypt-encryption.service';
import {
  isContactNumber,
  isEmail,
} from '@src/utils/validators/email-contact.validator';
import { throwIfNotFound } from '@src/utils/exceptions/common.exception';
import { RoleExternalService } from '@modules/authorization/services/role-external.service';
import { RoleEnum } from '@src/utils/enums/role.enums';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly bcryptEncryptionService: BcryptEncryptionService,
    private readonly roleExternalService: RoleExternalService,
  ) {}

  async createAdmin(adminDto: AdminDto): Promise<AdminEntity> {
    const getAdminWithProvidedEmail = await this.getAdminByEmailIdOrThrow(
      adminDto.email,
    );
    const getAdminWithContactNumber = await this.getAdminByContactNumber(
      adminDto.contactNumber,
    );

    if (getAdminWithContactNumber || getAdminWithProvidedEmail) {
      throw new BadRequestException(`User already exits with provided details`);
    }

    const encryptedPassword = await this.bcryptEncryptionService.encrypt(
      adminDto.password,
    );

    const role = await this.roleExternalService.getRoleDetails(RoleEnum.ADMIN);
    const roleId = role.id;

    const adminDataToSave = {
      ...adminDto,
      password: encryptedPassword,
      roleId,
    };
    return this.adminRepository.getRepository().save(adminDataToSave);
  }

  async getAdminByEmailIdOrThrow(email: string): Promise<AdminEntity> {
    const admin = this.adminRepository.getRepository().findOne({
      where: { email },
    });
    // Use the helper function to handle the NotFoundException
    throwIfNotFound(admin, `No user exists with the provided email`);
    return admin;
  }

  async getAdminByContactNumber(contactNumber: number): Promise<AdminEntity> {
    const admin = await this.adminRepository
      .getRepository()
      .findOne({ where: { contactNumber } });
    // throwIfNotFound(admin, `No user exists with the provided contactNumber`);
    return admin;
  }

  async getAdminByEmailOrContactNumber(
    username: string,
  ): Promise<AdminEntity | null> {
    const repository = this.adminRepository.getRepository();

    if (isEmail(username)) {
      return repository.findOne({ where: { email: username } });
    }

    if (isContactNumber(username)) {
      return repository.findOne({ where: { contactNumber: +username } });
    }

    throw new Error('Invalid username format');
  }

  async updatePassword(username: string, password: string): Promise<void> {
    const admin = await this.getAdminByEmailOrContactNumber(username);

    /// Use the helper function to handle the NotFoundException
    throwIfNotFound(admin, `No user exists with the provided ${username}`);

    const encryptedPassword =
      await this.bcryptEncryptionService.encrypt(password);
    admin.password = encryptedPassword;
    await this.adminRepository.getRepository().save(admin);
  }
}
