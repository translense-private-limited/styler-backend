import { ReviewEntity } from "../entities/review.entity";

export interface ReviewInterface{
    reviewId: number;
    customerId: number;
    serviceId: string;
    rating: number; 
    review?: string;
  }
  