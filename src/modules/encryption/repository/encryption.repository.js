import { InjectRepository } from "@nestjs/typeorm";
import { EncryptionEntity } from "../entities/encryption.entity";
import { getMysqlDataSource } from "@modules/database/data-source";
import { Repository } from "typeorm";
import { BaseRepository } from "@src/utils/repositories/base-repository";

export class EncryptionRepository extends BaseRepository<EncryptionEntity> {
    constructor(
        @InjectRepository(EncryptionEntity, getMysqlDataSource())
        protected repository: Repository<EncryptionEntity>,
    ) {
        super(repository);
    }
}