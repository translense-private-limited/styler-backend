import { BaseRepository } from '@src/utils/repositories/base-repository';

import { getMysqlDataSource } from '@modules/database/data-source';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventConfigurationEntity } from '../entities/even-configuration.entity';

export class EventConfigurationRepository extends BaseRepository<EventConfigurationEntity> {
  constructor(
    @InjectRepository(EventConfigurationEntity, getMysqlDataSource())
    protected repository: Repository<EventConfigurationEntity>,
  ) {
    super(repository);
  }
}
