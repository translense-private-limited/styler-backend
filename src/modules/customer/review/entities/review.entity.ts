import { BaseEntity } from '@src/utils/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn, Unique, Check } from 'typeorm';
import { ReviewInterface } from '../interfaces/review.interface';

@Entity('reviews') 
@Unique(['customerId', 'serviceId']) 
@Check('"rating" BETWEEN 1 AND 5')
export class ReviewEntity extends BaseEntity implements ReviewInterface{
  @PrimaryGeneratedColumn()
  reviewId: number; // Primary key

  @Column()
  customerId: number; 

  @Column()
  serviceId: string; 

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number; // Rating (1-5) with DB constraint

  @Column({ type: 'text', nullable: true })
  review: string;
}