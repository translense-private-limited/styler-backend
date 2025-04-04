import { Controller, Post, Body, Put } from '@nestjs/common';
import { AggregateRatingService } from '../services/aggregate-rating.service';
import { AggregatedRatingInterface } from '../interfaces/aggregated-rating.interface';
import { Public } from '@src/utils/decorators/public.decorator';
import { JobEnum } from '@src/utils/enums/job.enum';

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


  @Put('update')
  async updateTimestamp(@Body() body: { job: JobEnum; currentTimestamp: Date }) {
    console.log('currentTimeStamp', body.currentTimestamp);
    const updatedTimestamp = await this.aggregateRatingService.updateLastAggregatedTimeStamp(
      body.job,
      new Date(body.currentTimestamp),
    );
    return { updatedTimestamp };
  }
}

