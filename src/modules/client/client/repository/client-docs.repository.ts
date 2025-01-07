import { InjectRepository } from "@nestjs/typeorm";
import { ClientDocsEntity } from "../entities/client-docs.entity";
import { getMysqlDataSource } from "@modules/database/data-source";
import { Repository } from "typeorm";
import { BaseRepository } from "@src/utils/repositories/base-repository";

export class ClientDocsRepository extends BaseRepository<ClientDocsEntity>{
    constructor(
        @InjectRepository(ClientDocsEntity,getMysqlDataSource())
        protected repository:Repository<ClientDocsEntity>
    ){
        super(repository);
    }
}