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

@Module({
  imports: [
    ClientModule,
    EncryptionModule,
    CustomerModule,
    TypeOrmModule.forFeature([OtpEntity], getMysqlDataSource()),
  ],
  providers: [
    SellerAuthService,
    JwtService,
    CustomerAuthenticationService,
    OtpService,
    OtpRepository,
  ],
  exports: [SellerAuthService, JwtService],

  controllers: [
    ClientAuthController,
    CustomerAuthenticationController,
    OtpController,
  ],
})
export class AuthenticationModule {}
