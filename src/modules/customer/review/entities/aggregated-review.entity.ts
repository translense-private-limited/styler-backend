import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('aggregated_reviews')
export class AggregatedReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serviceId: string;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  avgRating: number;

  @Column()
  reviewCount: number;
}