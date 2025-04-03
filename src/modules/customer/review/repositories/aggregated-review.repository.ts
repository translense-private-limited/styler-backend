import { InjectRepository } from '@nestjs/typeorm';
import { getMysqlDataSource } from '@modules/database/data-source';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/utils/repositories/base-repository';
import { AggregatedReviewEntity } from '../entities/aggregated-review.entity';
export class AggregatedReviewRepository extends BaseRepository<AggregatedReviewEntity> {
  constructor(
    @InjectRepository(AggregatedReviewEntity, getMysqlDataSource())
    protected repository: Repository<AggregatedReviewEntity>
  ) {
    super(repository);
  }

  async upsertAggregatedReview(serviceId: string, avgRating: number, reviewCount: number): Promise<void> {
    const existingAggregatedReview = await this.repository.findOne({ where: { serviceId } });
    
    if (existingAggregatedReview) {
      existingAggregatedReview.avgRating =
        (existingAggregatedReview.avgRating * existingAggregatedReview.reviewCount +
          avgRating * reviewCount) /
        (existingAggregatedReview.reviewCount + reviewCount);
      existingAggregatedReview.reviewCount += reviewCount;
      await this.repository.save(existingAggregatedReview);
    } else {
      const newAggregatedReview = this.repository.create({
        serviceId,
        avgRating,
        reviewCount,
      });
      await this.repository.save(newAggregatedReview);
    }
  }
}
