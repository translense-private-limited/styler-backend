import { Controller, Post } from '@nestjs/common';
import { ReviewAggregationService } from '../services/aggregated-review.service';

@Controller('reviews')
export class ReviewAggregationController {
  constructor(private readonly reviewAggregationService: ReviewAggregationService) {}

  @Post('aggregate-reviews')
  async aggregateReviews(): Promise<void> {
    await this.reviewAggregationService.aggregateReviews();
  }
}