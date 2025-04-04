import { Injectable } from '@nestjs/common';
import { AggregatedReviewRepository } from '../repositories/aggregate-review.repository';
import { JobEnum } from '@src/utils/enums/job.enum';
import { TimestampRepository } from '../repositories/timestamp.repository';
import { ReviewService } from './review.service';
import { AggregatedReviewInterface } from '../interfaces/aggregated-review.interface';
import { In } from 'typeorm';
import { AggregatedReviewEntity } from '../entities/aggregate-review.entity';

@Injectable()
export class AggregateReviewService {
  constructor(
    private reviewService: ReviewService,
    private timestampRepository: TimestampRepository,
    private aggregatedReviewRepository: AggregatedReviewRepository,
  ) {}

  private async getLastAggregatedTimeStamp(job: JobEnum): Promise<Date> {
    const timestamp = await this.timestampRepository.getRepository().findOne({
      where: {
        jobName: job,
      },
    });
    return timestamp.lastSyncTime;
  }

  private async updateLastAggregatedTimeStamp(
    job: JobEnum,
    currentTimestamp: Date,
  ): Promise<Date> {
    const timestamp = await this.timestampRepository.getRepository().findOne({
      where: {
        jobName: job,
      },
    });
    timestamp.lastSyncTime = currentTimestamp;
    return timestamp.lastSyncTime;
  }

  private async updateAggregatedReviews(
    aggregatedReviews: AggregatedReviewInterface[],
  ): Promise<void> {
    const serviceIds = aggregatedReviews.map((review) => review.serviceId);

    // Fetch all existing records in a single query
    const existingReviews = await this.aggregatedReviewRepository
      .getRepository()
      .find({
        where: { serviceId: In(serviceIds) },
      });

    // Convert existing records into a map for quick lookup
    const existingReviewMap: Map<string, AggregatedReviewEntity> = new Map(
      existingReviews.map((review) => [review.serviceId, review]),
    );

    const updatedEntities: AggregatedReviewEntity[] = [];
    const newEntities: AggregatedReviewEntity[] = [];

    for (const review of aggregatedReviews) {
      const existing = existingReviewMap.get(review.serviceId);

      if (existing) {
        // Update existing record
        existing.avgRating =
          (existing.avgRating * existing.count + review.totalRating) /
          (existing.count + review.reviewCount);
        existing.count += review.reviewCount;

        updatedEntities.push(existing);
      } else {
        // Prepare new record for insertion
        const newAggregatedReview = this.aggregatedReviewRepository
          .getRepository()
          .create({
            serviceId: review.serviceId,
            avgRating: review.totalRating / review.reviewCount,
            count: review.reviewCount,
          });

        newEntities.push(newAggregatedReview);
      }
    }

    // Perform batch updates & inserts
    if (updatedEntities.length > 0) {
      await this.aggregatedReviewRepository
        .getRepository()
        .save(updatedEntities);
    }

    if (newEntities.length > 0) {
      await this.aggregatedReviewRepository.getRepository().save(newEntities);
    }
  }

  async aggregateReview(): Promise<void> {
    // determine the timestamp after which it needs to collect the review
    const lastRunAt = await this.getLastAggregatedTimeStamp(
      JobEnum.REVIEW_AGGREGATION_JOB,
    );
    const currentTimestamp = new Date();
    const aggregatedReviews =
      await this.reviewService.getAggregatedReview(lastRunAt);

    await this.updateAggregatedReviews(aggregatedReviews);

    await this.updateLastAggregatedTimeStamp(
      JobEnum.REVIEW_AGGREGATION_JOB,
      currentTimestamp,
    );
  }

  async getRatingByServiceId(
    serviceId: string,
  ): Promise<AggregatedReviewEntity> {
    return this.aggregatedReviewRepository.getRepository().findOne({
      where: {
        serviceId,
      },
    });
  }

  async getRatingByServiceIds(
    serviceIds: string[],
  ): Promise<AggregatedReviewEntity[]> {
    return this.aggregatedReviewRepository.getRepository().find({
      where: {
        serviceId: In(serviceIds),
      },
    });
  }
}
