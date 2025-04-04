import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Module } from '@nestjs/common';
import { getMysqlDataSource } from '@modules/database/data-source';
import { ReviewController } from './controllers/review.controller';
import { ReviewService } from './services/review.service';
import { ReviewRepository } from './repositories/review.repository';

import { OrderModule } from '../order/order.module';
import { AggregatedReviewEntity } from './entities/aggregate-review.entity';
import { AggregatedReviewRepository } from './repositories/aggregate-review.repository';
import { AggregateReviewService } from './services/aggregate-review.service';
import { TimestampRepository } from './repositories/timestamp.repository';
import { TimestampEntity } from './entities/timestamp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ReviewEntity, AggregatedReviewEntity, TimestampEntity],
      getMysqlDataSource(),
    ),
    OrderModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository, AggregatedReviewRepository, AggregateReviewService, TimestampRepository],
  exports: [],
})
export class ReviewModule {}
