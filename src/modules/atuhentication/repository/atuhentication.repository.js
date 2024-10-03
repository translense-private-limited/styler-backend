import { InjectRepository } from "@nestjs/typeorm";
import { AtuhenticationEntity } from "../entities/atuhentication.entity";
import { getMysqlDataSource } from "@modules/database/data-source";
import { Repository } from "typeorm";
import { BaseRepository } from "@src/utils/repositories/base-repository";

export class AtuhenticationRepository extends BaseRepository<AtuhenticationEntity> {
    constructor(
        @InjectRepository(AtuhenticationEntity, getMysqlDataSource())
        protected repository: Repository<AtuhenticationEntity>,
    ) {
        super(repository);
    }
}