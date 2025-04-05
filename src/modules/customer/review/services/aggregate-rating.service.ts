import { Injectable } from '@nestjs/common';
import { AggregatedRatingRepository } from '../repositories/aggregate-rating.repository';
import { JobEnum } from '@src/utils/enums/job.enum';
import { TimestampRepository } from '../repositories/timestamp.repository';
import { ReviewService } from './review.service';
import { AggregatedRatingInterface } from '../interfaces/aggregated-rating.interface';
import { In } from 'typeorm';
import { AggregatedRatingEntity } from '../entities/aggregate-rating.entity';

@Injectable()
export class AggregateRatingService {
  constructor(
    private reviewService: ReviewService,
    private timestampRepository: TimestampRepository,
    private aggregatedRatingRepository: AggregatedRatingRepository,
  ) {}

  private async getLastAggregatedTimeStamp(job: JobEnum): Promise<Date> {
    const timestamp = await this.timestampRepository.getRepository().findOne({
      where: {
        jobName: job,
      },
    });
    return timestamp.lastSyncTime;
  }

  async updateLastAggregatedTimeStamp(
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
    aggregatedReviews: AggregatedRatingInterface[],
  ): Promise<void> {
    const serviceIds = aggregatedReviews.map((review) => review.serviceId);

    // Fetch all existing records in a single query
    const existingReviews = await this.aggregatedRatingRepository
      .getRepository()
      .find({
        where: { serviceId: In(serviceIds) },
      });

    // Convert existing records into a map for quick lookup
    const existingReviewMap: Map<string, AggregatedRatingEntity> = new Map(
      existingReviews.map((review) => [review.serviceId, review]),
    );

    const updatedEntities: AggregatedRatingEntity[] = [];
    const newEntities: AggregatedRatingEntity[] = [];

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
        const newAggregatedReview = this.aggregatedRatingRepository
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
      await this.aggregatedRatingRepository
        .getRepository()
        .save(updatedEntities);
    }

    if (newEntities.length > 0) {
      await this.aggregatedRatingRepository.getRepository().save(newEntities);
    }
  }

  async aggregateReview(): Promise<void> {
    // determine the timestamp after which it needs to collect the review
    const lastRunAt = await this.getLastAggregatedTimeStamp(
      JobEnum.REVIEW_AGGREGATION_JOB,
    );
    const currentTimestamp = new Date();
    const aggregatedReviews =
      await this.reviewService.getAggregatedReview(lastRunAt, currentTimestamp);

    await this.updateAggregatedReviews(aggregatedReviews);

    await this.updateLastAggregatedTimeStamp(
      JobEnum.REVIEW_AGGREGATION_JOB,
      currentTimestamp,
    );
  }

  async getRatingByServiceId(
    serviceId: string,
  ): Promise<AggregatedRatingEntity> {
    return this.aggregatedRatingRepository.getRepository().findOne({
      where: {
        serviceId,
      },
    });
  }

  async getRatingByServiceIds(
    serviceIds: string[],
  ): Promise<AggregatedRatingEntity[]> {
    return this.aggregatedRatingRepository.getRepository().find({
      where: {
        serviceId: In(serviceIds),
      },
    });
  }
}
