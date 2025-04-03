import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../repositories/review.repository';
import { AggregatedReviewRepository } from '../repositories/aggregated-review.repository';

@Injectable()
export class ReviewAggregationService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly aggregatedReviewRepository: AggregatedReviewRepository
  ) {}

  async aggregateReviews(): Promise<void> {
    const unaggregatedReviews = await this.reviewRepository.findUnaggregatedReviews();
    const groupedReviews = this.groupByService(unaggregatedReviews);

    for (const [serviceId, { avgRating, reviewCount }] of Object.entries(groupedReviews)) {
      await this.aggregatedReviewRepository.upsertAggregatedReview(serviceId, avgRating, reviewCount);
    }

    await this.reviewRepository.markReviewsAsAggregated();
  }

  private groupByService(reviews: any[]): Record<string, { avgRating: number; reviewCount: number }> {
    const grouped: Record<string, { totalRating: number; count: number }> = {};

    reviews.forEach(({ serviceId, rating }) => {
      if (!grouped[serviceId]) {
        grouped[serviceId] = { totalRating: 0, count: 0 };
      }
      grouped[serviceId].totalRating += rating;
      grouped[serviceId].count += 1;
    });

    return Object.fromEntries(
      Object.entries(grouped).map(([serviceId, { totalRating, count }]) => [
        serviceId,
        { avgRating: totalRating / count, reviewCount: count },
      ])
    );
  }
}