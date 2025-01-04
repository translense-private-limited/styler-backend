import { InjectRepository } from "@nestjs/typeorm";
import { OutletDocsEntity } from "../entities/outlet-docs.entity";
import { getMysqlDataSource } from "@modules/database/data-source";
import { Repository } from "typeorm";
import { BaseRepository } from "@src/utils/repositories/base-repository";

export class OutletDocsRepository extends BaseRepository<OutletDocsEntity>{
    constructor(
        @InjectRepository(OutletDocsEntity,getMysqlDataSource())
        protected readonly repository:Repository<OutletDocsEntity>
    ){
        super(repository);
    }
}