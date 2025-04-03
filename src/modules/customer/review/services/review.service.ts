import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { CreateReviewDto } from '../dto/create-review.dto';
import { OrderRepository } from '@modules/customer/order/repositories/order.repository';
import { ReviewRepository } from '../repositories/review.repository';
import { ReviewEntity } from '../entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly orderRepository: OrderRepository, 
  ) {}

  async submitReview(createReviewDto: CreateReviewDto): Promise<ReviewEntity> {
    const { customerId, orderId, rating, review, serviceId } = createReviewDto;
    const order = await this.orderRepository.findOrderById(orderId, customerId);
    if (!order || order.status !== 'ORDER_COMPLETED') {
      throw new BadRequestException('Only completed orders can be reviewed.');
    }
    return await this.reviewRepository.getRepository().save(createReviewDto);
  }
}