import { Module } from "@nestjs/common";
import { OutletService } from "./services/outlet.service";
import { OutletRepository } from "./repositories/outlet.repository";
import { OutletController } from "./controllers/outlet.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OutletEntity } from "./entities/outlet.entity";
import { getMysqlDataSource } from "@modules/database/data-source";

@Module({
    imports: [
        TypeOrmModule.forFeature([OutletEntity], getMysqlDataSource())
    ],
    providers: [OutletService, OutletRepository],
    controllers: [OutletController]
})
export class OutletModule { }