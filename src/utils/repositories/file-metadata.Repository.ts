import { InjectRepository } from "@nestjs/typeorm";
import { FileMetadataEntity } from "../entities/file-metadata.entity";
import { getMysqlDataSource } from "@modules/database/data-source";
import { BaseRepository } from "./base-repository";
import { Repository } from "typeorm";

export class FileMetaDataRepository extends BaseRepository<FileMetadataEntity>{
    constructor(
        @InjectRepository(FileMetadataEntity,getMysqlDataSource())
        protected repository:Repository<FileMetadataEntity>
    ){
        super(repository)
    }
}