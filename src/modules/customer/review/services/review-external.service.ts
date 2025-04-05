import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewEntity } from '../entities/review.entity';

@Injectable()
export class ReviewExternalService {
  constructor(
    @Inject(forwardRef(() => ReviewService))
    private readonly reviewService: ReviewService,
  ) {}

  async getServiceReviewsByCustomerIdAndServiceIds(
    customerId: number,
    serviceIds: string[],
  ): Promise<ReviewEntity[]> {
    return this.reviewService.getServiceReviewsByCustomerIdAndServiceIds(
      customerId,
      serviceIds,
    );
  }
}
