import { BaseRepository } from "@src/utils/repositories/base-repository";
import { AdminEntity } from "../entities/admin.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { getMysqlDataSource } from "@modules/database/data-source";
import { Repository } from "typeorm";

export class AdminRepository extends BaseRepository<AdminEntity>{
    constructor(
        @InjectRepository(AdminEntity,getMysqlDataSource())
        protected repository:Repository<AdminEntity>
    ){
        super(repository)
    }
}