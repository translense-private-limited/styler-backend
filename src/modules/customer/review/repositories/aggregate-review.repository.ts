import { InjectRepository } from '@nestjs/typeorm';

import { getMysqlDataSource } from '@modules/database/data-source';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/utils/repositories/base-repository';
import { AggregatedReviewEntity } from '../entities/aggregate-review.entity';

export class AggregatedReviewRepository extends BaseRepository<AggregatedReviewEntity> {
  constructor(
    @InjectRepository(AggregatedReviewEntity, getMysqlDataSource())
    protected repository: Repository<AggregatedReviewEntity>,
  ) {
    super(repository);
  }
}
