import { Module } from "@nestjs/common";
import { OutletService } from "./services/outlet.service";
import { OutletRepository } from "./repositories/outlet.repository";
import { OutletController } from "./controllers/outlet.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OutletEntity } from "./entities/outlet.entity";
import { getMysqlDataSource } from "@modules/database/data-source";
import { OutletExternalService } from "./services/outlet-external.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([OutletEntity], getMysqlDataSource())
    ],
    providers: [OutletService, OutletRepository, OutletExternalService],
    controllers: [OutletController],
    exports: [OutletExternalService]
})
export class OutletModule { }