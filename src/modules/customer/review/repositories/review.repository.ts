import { InjectRepository } from '@nestjs/typeorm';

import { getMysqlDataSource } from '@modules/database/data-source';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/utils/repositories/base-repository';
import { ReviewEntity } from '../entities/review.entity';

export class ReviewRepository extends BaseRepository<ReviewEntity> {
  constructor(
    @InjectRepository(ReviewEntity, getMysqlDataSource())
    protected repository: Repository<ReviewEntity>,
  ) {
    super(repository);
  }

  async findUnaggregatedReviews(): Promise<ReviewEntity[]> {
    return await this.repository.find({ where: { isAggregated: false } });
  }

  async markReviewsAsAggregated(): Promise<void> {
    await this.repository.update({ isAggregated: false }, { isAggregated: true });
  }
}
