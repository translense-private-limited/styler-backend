import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";
import { getMysqlDataSource } from "@modules/database/data-source";
import { BcryptEncryptionService } from "./services/bcrypt-encryption.service";

@Module({
    imports: [
       
    ],
    providers: [ BcryptEncryptionService],
  
    exports: [BcryptEncryptionService]
})
export class EncryptionModule { }