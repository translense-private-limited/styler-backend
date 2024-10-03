import { Module } from "@nestjs/common";
import { EncryptionService } from "./services/encryption.service";
import { EncryptionRepository } from "./repository/encryption.repository";
import { EncryptionController } from "./controllers/encryption.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EncryptionEntity } from "./entities/encryption.entity";
import { getMysqlDataSource } from "@modules/database/data-source";

@Module({
    imports: [
        TypeOrmModule.forFeature([EncryptionEntity], getMysqlDataSource())
    ],
    providers: [EncryptionService, EncryptionRepository],
    controllers: [EncryptionController]
})
export class EncryptionModule { }