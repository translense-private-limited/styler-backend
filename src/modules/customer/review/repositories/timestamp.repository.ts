import { InjectRepository } from '@nestjs/typeorm';

import { getMysqlDataSource } from '@modules/database/data-source';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/utils/repositories/base-repository';
import { TimestampEntity } from '../entities/timestamp.entity';

export class TimestampRepository extends BaseRepository<TimestampEntity> {
  constructor(
    @InjectRepository(TimestampEntity, getMysqlDataSource())
    protected repository: Repository<TimestampEntity>,
  ) {
    super(repository);
  }
}
