import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Module } from '@nestjs/common';
import { getMysqlDataSource } from '@modules/database/data-source';
import { ReviewController } from './controllers/review.controller';
import { ReviewService } from './services/review.service';
import { ReviewRepository } from './repositories/review.repository';

import { OrderModule } from '../order/order.module';
import { AggregatedRatingEntity } from './entities/aggregate-rating.entity';
import { AggregatedRatingRepository } from './repositories/aggregate-rating.repository';
import { AggregateRatingService } from './services/aggregate-rating.service';
import { TimestampRepository } from './repositories/timestamp.repository';
import { TimestampEntity } from './entities/timestamp.entity';
import { AggregatedRatingController } from './controllers/aggregated-rating.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ReviewEntity, AggregatedRatingEntity, TimestampEntity],
      getMysqlDataSource(),
    ),
    OrderModule,
  ],
  controllers: [ReviewController, AggregatedRatingController],
  providers: [ReviewService, ReviewRepository, AggregatedRatingRepository, AggregateRatingService, TimestampRepository],
  exports: [],
})
export class ReviewModule {}
