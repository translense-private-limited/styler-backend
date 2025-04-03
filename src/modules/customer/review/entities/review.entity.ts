import { BaseEntity } from '@src/utils/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn, Unique, Check } from 'typeorm';
import { ReviewInterface } from '../interfaces/review.interface';

@Entity('reviews') 
@Unique(['customerId', 'serviceId']) 
@Check('"rating" BETWEEN 0 AND 5')
export class ReviewEntity extends BaseEntity implements ReviewInterface{
  @PrimaryGeneratedColumn()
  reviewId: number; // Primary key

  @Column()
  customerId: number; 

  @Column()
  serviceId: string; 

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  review?: string;

  @Column({ type: 'boolean', default: false })
  isAggregated: boolean;
}