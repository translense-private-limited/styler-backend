import { InjectRepository } from "@nestjs/typeorm";
import { rolesEntity } from "../entities/roles.entity";
import { getMysqlDataSource } from "@modules/database/data-source";
import { Repository } from "typeorm";
import { BaseRepository } from "@src/utils/repositories/base-repository";

export class rolesRepository extends BaseRepository<rolesEntity> {
    constructor(
        @InjectRepository(rolesEntity, getMysqlDataSource())
        protected repository: Repository<rolesEntity>,
    ) {
        super(repository);
    }
}