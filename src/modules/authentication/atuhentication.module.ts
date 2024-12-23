import { Module } from '@nestjs/common';

//import { TypeOrmModule } from "@nestjs/typeorm";

//import { getMysqlDataSource } from "@modules/database/data-source";
import { ClientModule } from '@modules/client/client.module';
import { ClientAuthController } from './controllers/client-authentication.controller';
import { SellerAuthService } from './services/seller-auth.service';
import { EncryptionModule } from '@modules/encryption/encryption.module';
import { JwtService } from './services/jwt.service';
import { CustomerAuthenticationController } from './controllers/customer-authentication.controller';
import { CustomerAuthenticationService } from './services/customer-authentication.service';
import { CustomerModule } from '@modules/customer/customer.module';
import { OtpController } from './controllers/otp.controller';
import { OtpService } from './services/otp.service';
import { OtpRepository } from './repositories/otp.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from './entities/otp.entity';
import { getMysqlDataSource } from '@modules/database/data-source';
import { OtpExternalService } from './services/otp-external.service';
import { AdminAuthenticationService } from './services/admin-auth.service';
import { AdminAuthenticationController } from './controllers/admin-authentication.controller';
import { AdminModule } from '@modules/admin/admin.module';
import { AuthorizationModule } from '@modules/authorization/authorization.module';
import { AdminClientController } from './controllers/admin-client.controller';
import { AdminClientService } from './services/admin-client.service';
import { ClientOutletMappingModule } from '@modules/admin/client-outlet-mapping/client-outlet-mapping.module';

@Module({
  imports: [
    ClientModule,
    AdminModule,
    EncryptionModule,
    CustomerModule,
    TypeOrmModule.forFeature([OtpEntity], getMysqlDataSource()),
    AuthorizationModule,
    ClientOutletMappingModule
  ],
  providers: [
    SellerAuthService,
    JwtService,
    CustomerAuthenticationService,
    OtpService,
    OtpRepository,
    OtpExternalService,
    AdminAuthenticationService,
    AdminClientService
  ],
  exports: [SellerAuthService, JwtService, OtpExternalService],

  controllers: [
    ClientAuthController,
    CustomerAuthenticationController,
    OtpController,
    AdminAuthenticationController,
    AdminClientController
  ],
})
export class AuthenticationModule {}
