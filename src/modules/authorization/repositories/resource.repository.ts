import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '@src/utils/repositories/base-repository';
import { getMysqlDataSource } from '@modules/database/data-source';
import { Repository } from 'typeorm';
import { ResourceEntity } from '../entities/resource.entity';


@Injectable()
export class ResourceRepository extends BaseRepository<ResourceEntity> {
  constructor(
    @InjectRepository(ResourceEntity, getMysqlDataSource())
    private repository: Repository<ResourceEntity>,
  ) {
    super(repository);
  }
}
