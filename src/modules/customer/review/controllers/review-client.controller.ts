import { Controller, Query, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewService } from '../services/review.service';

import { ReviewEntity } from '../entities/review.entity';

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
