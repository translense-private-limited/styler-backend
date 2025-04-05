import { BaseEntity } from '@src/utils/entities/base.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  Check,
  Index,
} from 'typeorm';
import { ReviewInterface } from '../interfaces/review.interface';

@Entity('reviews')
@Unique(['customerId', 'serviceId']) // Ensures unique combination of customerId and serviceId
@Check('"rating" BETWEEN 0 AND 5') // Ensures rating is between 0 and 5
export class ReviewEntity extends BaseEntity implements ReviewInterface {
  @PrimaryGeneratedColumn() // Ensuring this is the ONLY auto-increment column
  id: number;

  @Index()
  @Column({ type: 'int' })
  customerId: number;

  @Index()
  @Column({ type: 'varchar', length: 255 }) // If serviceId is a string
  serviceId: string;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  review?: string;
}
