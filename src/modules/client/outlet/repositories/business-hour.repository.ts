import { InjectRepository } from '@nestjs/typeorm';

import { getMysqlDataSource } from '@modules/database/data-source';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/utils/repositories/base-repository';
import { BusinessHourEntity } from '../entities/business-hours.entity';

export class BusinessHourRepository extends BaseRepository<BusinessHourEntity> {
  constructor(
    @InjectRepository(BusinessHourEntity, getMysqlDataSource())
    protected readonly repository: Repository<BusinessHourEntity>,
  ) {
    super(repository);
  }
}
