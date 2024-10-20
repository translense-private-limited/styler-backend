import { InjectRepository } from "@nestjs/typeorm";
import { ClientEntity } from "../entities/client.entity";
import { getMysqlDataSource } from "@modules/database/data-source";
import { Repository } from "typeorm";
import { BaseRepository } from "@src/utils/repositories/base-repository";

export class ClientRepository extends BaseRepository<ClientEntity> {
    constructor(
        @InjectRepository(ClientEntity, getMysqlDataSource())
        protected repository: Repository<ClientEntity>,
    ) {
        super(repository);
    }
}