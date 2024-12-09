// import { Injectable } from '@nestjs/common';
// import { AuthServiceInterface } from '../interfaces/auth-service.interface';

import { AdminExternalService } from '@modules/admin/services/admin-external.service';
import { BcryptEncryptionService } from '@modules/encryption/services/bcrypt-encryption.service';
import { JwtService } from './jwt.service';
import { AdminSignupDto } from '../dtos/admin-signup.dto';
import { AdminLoginResponseInterface } from '../interfaces/admin-login-response.interface';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminDto } from '@modules/admin/dtos/admin.dto';
import { AdminTokenPayloadInterface } from '../interfaces/admin-token-payload.interface';
import { LoginDto } from '../dtos/login.dto';
import { throwIfNotFound } from '@src/utils/exceptions/common.exception';
import { RoleExternalService } from '@modules/authorization/services/role-external.service';
import { AdminEntity } from '@modules/admin/entities/admin.entity';
import { RoleEntity } from '@modules/authorization/entities/role.entity';
import { RoleEnum } from '@src/utils/enums/role.enums';

// @Injectable()
// export class AdminAuthService implements AuthServiceInterface {
//   async validateUser(email: string, password: string): Promise<any> {
//     // Admin-specific logic for validation
//   }

//   generateToken(user: any): string {
//     // Generate token for admin
//     return 'admin-token';
//   }
// }
@Injectable()
export class AdminAuthenticationService {
  constructor(
    private readonly adminExternalService: AdminExternalService,
    private readonly bcryptEncryptionService: BcryptEncryptionService,
    private jwtService: JwtService,
    private readonly roleExternalService: RoleExternalService,
  ) {}

  async registerAdmin(
    adminSignupDto: AdminSignupDto,
  ): Promise<AdminLoginResponseInterface> {
    console.log("first-register admin")
    const getAdminByContactNumber =
      await this.adminExternalService.getAdminByContactNumber(
        adminSignupDto.contactNumber,
      );

    const getAdminByEmail =
      await this.adminExternalService.getAdminByEmailIdOrThrow(
        adminSignupDto.email,
      );

    if (getAdminByContactNumber && getAdminByEmail) {
      throw new ConflictException(
        `Admin already exists with the provided email and contact number. Please choose unique details.`,
      );
    } else if (getAdminByContactNumber) {
      throw new ConflictException(
        `Admin already exists with the provided contact number. Please choose a unique contact number.`,
      );
    } else if (getAdminByEmail) {
      throw new ConflictException(
        `Admin already exists with the provided email. Please choose a unique email.`,
      );
    }
    // encrypt the password and create the admin
    const admin = await this.adminExternalService.save(adminSignupDto);

    const tokenPayload = await this.constructJwtPayload(admin);
    const token = await this.jwtService.generateToken(tokenPayload);
    const role = await this.roleExternalService.getRoleByIdOrThrow(
      admin.roleId,
    );
    const response = this.getLoginResponseDto(admin, role, token);
    return response;
  }

  async constructJwtPayload(
    admin: AdminDto,
  ): Promise<AdminTokenPayloadInterface> {
    const role = await this.roleExternalService.getRoleDetails(RoleEnum.ADMIN);
    const tokenPayload: AdminTokenPayloadInterface = {
      name: admin.name,
      email: admin.email,
      contactNumber: admin.contactNumber,
      roleId: role.id,
    };
    return tokenPayload;
  }

  private getLoginResponseDto(
    admin: AdminEntity,
    role: RoleEntity,
    token: string,
  ): AdminLoginResponseInterface {
    const loginResponse: AdminLoginResponseInterface = {
      token,
      admin: {
        adminId: admin.id,
        name: admin.name,
        contactNumber: admin.contactNumber,
        email: admin.email,

        role: role,
      },
    };
    return loginResponse;
  }

  public async adminLogin(
    loginDto: LoginDto,
  ): Promise<AdminLoginResponseInterface> {
    const { username, password } = loginDto;

    const admin =
      await this.adminExternalService.getAdminByEmailOrContactNumber(username);
    // Use the helper function to handle the NotFoundException
    throwIfNotFound(admin, `No user exists with the provide credentials`);
    const isValid = await this.bcryptEncryptionService.validate(
      password,
      admin.password,
    );
    if (!isValid) {
      throw new UnauthorizedException(`Invalid Credentials`);
    }
    // prepare the jwt and pass in body
    const tokenPayload = this.constructJwtPayload(admin);

    // encrypt token
    const token = this.jwtService.generateToken(tokenPayload);

    const role = await this.roleExternalService.getRoleByIdOrThrow(
      admin.roleId,
    );

    const loginResponseDto = this.getLoginResponseDto(admin, role, token);
    return loginResponseDto;
  }
}
