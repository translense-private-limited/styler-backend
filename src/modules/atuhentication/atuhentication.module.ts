import { Module } from "@nestjs/common";


import { TypeOrmModule } from "@nestjs/typeorm";

import { getMysqlDataSource } from "@modules/database/data-source";
import { ClientModule } from "@modules/client/client.module";
import { ClientAuthController } from "./controllers/client-authentication.controller";
import { SellerAuthService } from "./services/seller-auth.service";
import { EncryptionModule } from "@modules/encryption/encryption.module";
import { JwtService } from "./services/jwt.service";

@Module({
    imports: [
        ClientModule,
        EncryptionModule,
    ],
    providers: [ SellerAuthService, JwtService],
    exports: [ SellerAuthService, JwtService],

    controllers: [ClientAuthController]
})
export class AuthenticationModule { }