import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { CreateReviewDto } from '../dto/create-review.dto';
import { ReviewRepository } from '../repositories/review.repository';
import { ReviewEntity } from '../entities/review.entity';
import { OrderStatusEnum } from '@modules/customer/order/enums/order-status.enum';
import { OrderExternalService } from '@modules/customer/order/services/order-external.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly orderExternalService: OrderExternalService, 
  ) {}

  async submitReview(createReviewDto: CreateReviewDto): Promise<ReviewEntity> {
    const { customerId, orderId } = createReviewDto;
    const order = await this.orderExternalService.getOrderDetails(orderId, customerId);
    if (!order || order.status !== OrderStatusEnum.ORDER_COMPLETED) {
      throw new BadRequestException('Only completed orders can be reviewed.');
    }
    return await this.reviewRepository.getRepository().save(createReviewDto);
  }
}