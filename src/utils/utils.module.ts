import { Module } from "@nestjs/common";
import { AddressRepository } from "./repositories/address.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressEntity } from "./entities/address.entity";
import { getMysqlDataSource } from "@modules/database/data-source";

@Module({
    imports:[TypeOrmModule.forFeature([AddressEntity],getMysqlDataSource())],
    controllers:[],
    providers:[AddressRepository],
    exports:[AddressRepository],
})

export class UtilsModule{}
