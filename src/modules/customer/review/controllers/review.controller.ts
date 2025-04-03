import { Controller, Post, Body} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReviewService } from '../services/review.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { ReviewEntity } from '../entities/review.entity';

@ApiTags('Customer/Reviews')
@Controller('customer')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('review')
  async submitReview(
    @Body() createReviewDto: CreateReviewDto
  ): Promise<ReviewEntity> {
    return this.reviewService.submitReview(createReviewDto);
  }
}