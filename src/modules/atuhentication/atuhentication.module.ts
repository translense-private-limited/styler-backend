import { Module } from "@nestjs/common";
import { AtuhenticationService } from "./services/atuhentication.service";
import { AtuhenticationRepository } from "./repository/atuhentication.repository";
import { AtuhenticationController } from "./controllers/atuhentication.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AtuhenticationEntity } from "./entities/atuhentication.entity";
import { getMysqlDataSource } from "@modules/database/data-source";
import { ClientModule } from "@modules/client/client.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([AtuhenticationEntity], getMysqlDataSource()),
        ClientModule
    ],
    providers: [AtuhenticationService, AtuhenticationRepository],
    controllers: [AtuhenticationController]
})
export class AtuhenticationModule { }