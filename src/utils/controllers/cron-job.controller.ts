import { AggregateRatingService } from '@modules/customer/review/services/aggregate-rating.service';
import { Controller, Get } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';

@Public()
@Controller('cronjob')
export class CronJobController {
  constructor(
    private readonly aggregateRatingService: AggregateRatingService,
  ) {}

  @Get()
  async runCronJob(): Promise<void> {
    await this.aggregateRatingService.aggregateReview();
  }
}
