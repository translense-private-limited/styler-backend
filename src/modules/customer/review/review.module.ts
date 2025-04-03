import { TypeOrmModule } from "@nestjs/typeorm";
import { ReviewEntity } from "./entities/review.entity";
import { forwardRef, Module } from "@nestjs/common";
import { getMysqlDataSource } from "@modules/database/data-source";
import { ReviewController } from "./controllers/review.controller";
import { ReviewService } from "./services/review.service";
import { ReviewRepository } from "./repositories/review.repository";
import { OrderModule } from "../order/order.module";

@Module({
  imports: [    
    TypeOrmModule.forFeature(
      [ReviewEntity],
      getMysqlDataSource(),
    ),
    forwardRef(() => OrderModule),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository],
  exports: [],
})
export class ReviewModule {}