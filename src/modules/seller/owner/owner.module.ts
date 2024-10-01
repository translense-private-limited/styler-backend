import { Module } from "@nestjs/common";
import { OwnerService } from "./services/owner.service";
import { OwnerRepository } from "./repository/owner.repository";
import { OwnerController } from "./controllers/owner.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OwnerEntity } from "./entities/owner.entity";
import { getMysqlDataSource } from "@modules/database/data-source";

@Module({
    imports: [
        TypeOrmModule.forFeature([OwnerEntity], getMysqlDataSource())
    ],
    providers: [OwnerService, OwnerRepository],
    controllers: [OwnerController]
})
export class OwnerModule { }