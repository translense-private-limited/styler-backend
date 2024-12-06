// import { Injectable } from '@nestjs/common';
// import { AuthServiceInterface } from '../interfaces/auth-service.interface';

import { AdminExternalService } from "@modules/admin/services/admin-external.service";
import { BcryptEncryptionService } from "@modules/encryption/services/bcrypt-encryption.service";
import { JwtService } from "./jwt.service";
import { AdminSignupDto } from "../dtos/admin-signup.dto";
import { AdminLoginResponseInterface } from "../interfaces/admin-login-response.interface";
import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AdminDto } from "@modules/admin/dtos/admin.dto";
import { AdminTokenPayloadInterface } from "../interfaces/admin-token-payload.interface";
import { LoginDto } from "../dtos/login.dto";
import { throwIfNotFound } from "@src/utils/exceptions/common.exception";

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
export class AdminAuthenticationService{
    constructor(
        private readonly adminExternalService:AdminExternalService,
        private readonly bcryptEncryptionService:BcryptEncryptionService,
        private jwtService:JwtService,
    ){}

    async registerAdmin(adminSignupDto:AdminSignupDto):Promise<AdminLoginResponseInterface>{
        const adminByContactNumber = 
            await this.adminExternalService.getAdminByContactNumber(
                adminSignupDto.contactNumber,
            );

        const adminByEmail = await this.adminExternalService.getAdminByEmailIdOrThrow(adminSignupDto.email);

        if (adminByContactNumber && adminByEmail) {
            throw new ConflictException(
                `Admin already exists with the provided email and contact number. Please choose unique details.`
            );
        } else if (adminByContactNumber) {
            throw new ConflictException(
                `Admin already exists with the provided contact number. Please choose a unique contact number.`
            );
        } else if (adminByEmail) {
            throw new ConflictException(
                `Admin already exists with the provided email. Please choose a unique email.`
            );
        }        
        // encrypt the password and create the admin
        const admin = await this.adminExternalService.save(adminSignupDto);

        const tokenPayload = await this.constructJwtPayload(admin);
        const token = await this.jwtService.generateToken(tokenPayload);

        return{
            token,
            admin
        } 
    }

    async constructJwtPayload(
        admin: AdminDto,
      ): Promise<AdminTokenPayloadInterface> {
        const tokenPayload: AdminTokenPayloadInterface = {
          name: admin.name,
          email: admin.email,
          contactNumber: admin.contactNumber,
        };
        return tokenPayload;
      }

    async adminLogin(
        loginDto:LoginDto
    ):Promise<AdminLoginResponseInterface>{
        const { username,password } = loginDto;

        const admin = await this.adminExternalService.getAdminByEmailOrContactNumber(username);

        // Use the helper function to handle the NotFoundException
        throwIfNotFound(admin, `No user exists with the provide credentials`);
        const isValid = await this.bcryptEncryptionService.validate(password,admin.password);
        if(!isValid){
            throw new UnauthorizedException(`Invalid Credentials`)
        }
            // prepare the jwt and pass in body
        const tokenPayload = this.constructJwtPayload(admin);

        // encrypt token
        const token = this.jwtService.generateToken(tokenPayload);

        // remove password from
        delete admin.password;

        return {
            token,
            admin,
        }; 
    }
}