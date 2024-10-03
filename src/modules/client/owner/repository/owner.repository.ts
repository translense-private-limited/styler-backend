import { InjectRepository } from "@nestjs/typeorm";
import { OwnerEntity } from "../entities/owner.entity";
import { getMysqlDataSource } from "@modules/database/data-source";
import { Repository } from "typeorm";
import { BaseRepository } from "@src/utils/repositories/base-repository";

export class OwnerRepository extends BaseRepository<OwnerEntity> {
    constructor(
        @InjectRepository(OwnerEntity, getMysqlDataSource())
        protected repository: Repository<OwnerEntity>,
    ) {
        super(repository);
    }
}