// import { Injectable } from '@nestjs/common';
// import { AuthServiceInterface } from '../interfaces/auth-service.interface';

import { AdminExternalService } from "@modules/admin/services/admin-external.service";
import { BcryptEncryptionService } from "@modules/encryption/services/bcrypt-encryption.service";
import { JwtService } from "./jwt.service";
import { OtpService } from "./otp.service";
import { AdminSignupDto } from "../dtos/admin-signup.dto";
import { AdminLoginResponseInterface } from "../interfaces/admin-login-response.interface";
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AdminDto } from "@modules/admin/dtos/admin.dto";
import { AdminTokenPayloadInterface } from "../interfaces/admin-token-payload.interface";
import { LoginDto } from "../dtos/login.dto";

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
        private otpService:OtpService
    ){}

    async registerAdmin(adminSignupDto:AdminSignupDto):Promise<AdminLoginResponseInterface>{
        console.log(this.adminExternalService)
        const adminByContactNumber = 
            await this.adminExternalService.getAdminByContactNumber(
                adminSignupDto.contactNumber,
            );

        const adminByEmail = await this.adminExternalService.getAdminByEmail(adminSignupDto.email);

        if(adminByContactNumber|| adminByEmail){
            throw new ConflictException(
                `Admin already existed with the provided email or contact number, please choose unique details`
            )
        }
        // encrypt the password and create the admin
        const admin = await this.adminExternalService.save(adminSignupDto);

        const tokenPayload = await this.constructJwtPayload(admin);
        const token = await this.jwtService.generateToken(tokenPayload);

        //delete data from the otpEntity
        await this.otpService.deleteByRecipient(
            adminSignupDto.contactNumber.toString(),
        )
        await this.otpService.deleteByRecipient(adminSignupDto.email);

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

        if(!admin){
            throw new NotFoundException(`no user found with the provided credentials`)
        }
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