import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { CreateReviewDto } from '../dto/create-review.dto';
import { ReviewRepository } from '../repositories/review.repository';
import { ReviewEntity } from '../entities/review.entity';
import { OrderStatusEnum } from '@modules/customer/order/enums/order-status.enum';
import { OrderExternalService } from '@modules/customer/order/services/order-external.service';
import { AggregatedRatingInterface } from '../interfaces/aggregated-rating.interface';
import { PaginatedSearchDto } from '@src/utils/response/dtos/search.dto';
import { In } from 'typeorm';

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
    // handle the case of duplicate entry (same customer reviewing twice )
    return await this.reviewRepository.getRepository().save(createReviewDto);
  }

  async getAggregatedReview(
    lastRunAt: Date,
    currentTimestamp: Date,
  ): Promise<AggregatedRatingInterface[]> {
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
      .getRawMany<AggregatedRatingInterface>();
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

  async getReviewForService(
    serviceId: string,
    paginatedSearchDto?: PaginatedSearchDto,
  ): Promise<ReviewEntity[]> {
    const limit = this.reviewRepository.getLimit(paginatedSearchDto);
    const offset = this.reviewRepository.getSkip(paginatedSearchDto);
    return await this.reviewRepository.getRepository().find({
      where: {
        serviceId,
      },
      take: limit,
      skip: offset,
    });
  }

  async getServiceReviewsByCustomerIdAndServiceIds(
    customerId: number,
    serviceIds: string[],
  ): Promise<ReviewEntity[]> {
    return this.reviewRepository.getRepository().find({
      where: {
        serviceId: In(serviceIds),
      },
    });
  }
}
