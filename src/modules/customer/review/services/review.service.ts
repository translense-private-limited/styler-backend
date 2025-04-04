import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { CreateReviewDto } from '../dto/create-review.dto';
import { ReviewRepository } from '../repositories/review.repository';
import { ReviewEntity } from '../entities/review.entity';
import { OrderStatusEnum } from '@modules/customer/order/enums/order-status.enum';
import { OrderExternalService } from '@modules/customer/order/services/order-external.service';
import { AggregatedReviewInterface } from '../interfaces/aggregated-review.interface';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly orderExternalService: OrderExternalService,
  ) {}

  async submitReview(createReviewDto: CreateReviewDto): Promise<ReviewEntity> {
    const { customerId, orderId } = createReviewDto;
    const order = await this.orderExternalService.getOrderDetails(
      orderId,
      customerId,
    );
    // const order = await this.orderRepository.findOrderById(orderId, customerId);
    if (!order || order.status !== OrderStatusEnum.ORDER_COMPLETED) {
      throw new BadRequestException('Only completed orders can be reviewed.');
    }
    return await this.reviewRepository.getRepository().save(createReviewDto);
  }

  async getAggregatedReview(
    lastRunAt: Date,
    currentTimestamp: Date,
  ): Promise<AggregatedReviewInterface[]> {
    return this.reviewRepository
      .getRepository()
      .createQueryBuilder('review')
      .select('review.serviceId', 'serviceId')
      .addSelect('SUM(review.rating)', 'totalRating')
      .addSelect('COUNT(review.id)', 'reviewCount')
      .where('review.updatedAt BETWEEN :lastRunAt AND :currentTimestamp', {
        lastRunAt,
        currentTimestamp,
      })
      .groupBy('review.serviceId')
      .getRawMany<AggregatedReviewInterface>();
  }

  async getReviewByCustomerId(
    customerId: number,
    serviceId: string,
  ): Promise<ReviewEntity> {
    return this.reviewRepository.getRepository().findOne({
      where: {
        serviceId,
        customerId,
      },
    });
  }
}
