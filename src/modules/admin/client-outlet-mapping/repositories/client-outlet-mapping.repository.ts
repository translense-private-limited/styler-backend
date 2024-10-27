import { InjectRepository } from "@nestjs/typeorm";

import { getMysqlDataSource } from "@modules/database/data-source";
import { Repository } from "typeorm";
import { BaseRepository } from "@src/utils/repositories/base-repository";
import { ClientOutletMappingEntity } from "../entities/client-outlet-mapping.entity";

export class ClientOutletMappingRepository extends BaseRepository<ClientOutletMappingEntity> {
    constructor(
        @InjectRepository(ClientOutletMappingEntity, getMysqlDataSource())
        protected repository: Repository<ClientOutletMappingEntity>,
    ) {
        super(repository);
    }
}