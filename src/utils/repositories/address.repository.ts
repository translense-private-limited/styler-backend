import { InjectRepository } from "@nestjs/typeorm";
import { AddressEntity } from "../entities/address.entity";
import { BaseRepository } from "./base-repository";
import { getMysqlDataSource } from "@modules/database/data-source";
import { Repository } from "typeorm";

export class AddressRepository extends BaseRepository<AddressEntity>{
    constructor(
        @InjectRepository(AddressEntity,getMysqlDataSource())
        protected repository:Repository<AddressEntity>,
    ){
        super(repository)
    }
    
}