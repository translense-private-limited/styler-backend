import { Controller, Post, Body } from '@nestjs/common';
import { AggregateRatingService } from '../services/aggregate-rating.service';
import { AggregatedRatingInterface } from '../interfaces/aggregated-rating.interface';
import { Public } from '@src/utils/decorators/public.decorator';

@Public()
@Controller('aggregate-rating')
export class AggregatedRatingController {
  constructor(private readonly aggregateRatingService: AggregateRatingService) {}


//   FOR TESTING ONLY
  @Post('update-reviews')            
  async updateAggregatedReviews(
    @Body() aggregatedReviews: AggregatedRatingInterface[],
  ): Promise<string> {
    await this.aggregateRatingService['updateAggregatedReviews'](
      aggregatedReviews,
    );
    return 'Aggregated reviews updated successfully';
  }
}

