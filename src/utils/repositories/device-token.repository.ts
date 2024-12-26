import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "./base-repository";
import { getMysqlDataSource } from "@modules/database/data-source";
import { Repository } from "typeorm";
import { DeviceTokenEntity } from "../entities/device-token.entity";

export class DeviceTokenRepository extends BaseRepository<DeviceTokenEntity>{
    constructor(
        @InjectRepository(DeviceTokenEntity,getMysqlDataSource())
        protected repository:Repository<DeviceTokenEntity>,
    ){
        super(repository)
    }
    
}