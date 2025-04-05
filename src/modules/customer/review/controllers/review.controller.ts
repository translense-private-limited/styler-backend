import { Controller, Post, Body, Query, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewService } from '../services/review.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { ReviewEntity } from '../entities/review.entity';
import { AggregatedRatingEntity } from '../entities/aggregate-rating.entity';
import { AggregateRatingService } from '../services/aggregate-rating.service';
import { PaginatedSearchDto } from '@src/utils/response/dtos/search.dto';


@ApiBearerAuth('jwt')
@ApiTags('Customer/Reviews')
@Controller('customer')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private aggregateReviewService: AggregateRatingService,
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
  ): Promise<AggregatedRatingEntity[]> {
    const serviceIdsArray = serviceIds.split(','); // Convert string to array
    return this.aggregateReviewService.getRatingByServiceIds(serviceIdsArray);
  }

  /**
   * Get rating and review given by a customer for a particular service
   */
  @Get('reviews/customer')
  @ApiOperation({
    summary: 'get review details for service by user',
  })
  async getReviewByCustomer(
    @Query('customerId') customerId: number,
    @Query('serviceId') serviceId: string,
  ): Promise<ReviewEntity | null> {
    return this.reviewService.getReviewByCustomerId(customerId, serviceId);
  }

  @Get('reviews/service/:serviceId')
  @ApiOperation({
    summary: 'Get review details for service by user',
  })
  async getReviews(
    @Param('serviceId') serviceId: string,
    @Query() paginatedSearchDto: PaginatedSearchDto,
  ): Promise<ReviewEntity[]> {
    return this.reviewService.getReviewForService(
      serviceId,
      paginatedSearchDto,
    );
  }
}
