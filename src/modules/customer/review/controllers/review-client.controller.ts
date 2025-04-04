import { Controller, Query, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewService } from '../services/review.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { ReviewEntity } from '../entities/review.entity';
import { AggregatedRatingEntity } from '../entities/aggregate-rating.entity';
import { AggregateRatingService } from '../services/aggregate-rating.service';
import { PaginatedSearchDto } from '@src/utils/response/dtos/search.dto';

@ApiTags('Customer/Reviews')
@Controller('client')
export class ReviewClientController {
  constructor(private readonly reviewService: ReviewService) {}

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
