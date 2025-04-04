import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReviewService } from '../services/review.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { ReviewEntity } from '../entities/review.entity';
import { AggregatedReviewEntity } from '../entities/aggregate-review.entity';
import { AggregateReviewService } from '../services/aggregate-review.service';

@ApiTags('Customer/Reviews')
@Controller('customer')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private aggregateReviewService: AggregateReviewService,
  ) {}

  @Post('review')
  async submitReview(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewEntity> {
    return this.reviewService.submitReview(createReviewDto);
  }

  @Get('ratings')
  async getRatingsForServices(
    @Query('serviceIds') serviceIds: string,
  ): Promise<AggregatedReviewEntity[]> {
    const serviceIdsArray = serviceIds.split(','); // Convert string to array
    return this.aggregateReviewService.getRatingByServiceIds(serviceIdsArray);
  }

  /**
   * Get rating and review given by a customer for a particular service
   */
  @Get('reviews/customer')
  async getReviewByCustomer(
    @Query('customerId') customerId: number,
    @Query('serviceId') serviceId: string,
  ): Promise<ReviewEntity | null> {
    return this.reviewService.getReviewByCustomerId(customerId, serviceId);
  }
}
