import { InjectRepository } from '@nestjs/typeorm';

import { getMysqlDataSource } from '@modules/database/data-source';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/utils/repositories/base-repository';
import { AggregatedRatingEntity } from '../entities/aggregate-rating.entity';

export class AggregatedReviewRepository extends BaseRepository<AggregatedRatingEntity> {
  constructor(
    @InjectRepository(AggregatedRatingEntity, getMysqlDataSource())
    protected repository: Repository<AggregatedRatingEntity>,
  ) {
    super(repository);
  }
}
