import { IsInt, IsString, Min, Max, IsOptional } from 'class-validator';
import { ReviewInterface } from '../interfaces/review.interface';

export class CreateReviewDto implements Omit<ReviewInterface, 'id'> {
  @IsInt()
  customerId: number;

  @IsInt()
  orderId: number;

  @IsInt()
  @Min(0.5)
  @Max(5)
  rating: number;

  @IsString()
  serviceId: string;

  @IsString()
  @IsOptional()
  review?: string;
}
