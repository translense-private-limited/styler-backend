import { Module } from "@nestjs/common";
import { rolesService } from "./services/roles.service";
import { rolesRepository } from "./repositories/roles.repository";
import { rolesController } from "./controllers/roles.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { rolesEntity } from "./entities/roles.entity";
import { getMysqlDataSource } from "@modules/database/data-source";

@Module({
    imports: [
        TypeOrmModule.forFeature([rolesEntity], getMysqlDataSource())
    ],
    providers: [rolesService, rolesRepository],
    controllers: [rolesController]
})
export class rolesModule { }