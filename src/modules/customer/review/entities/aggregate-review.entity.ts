import { BaseEntity } from '@src/utils/entities/base.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('reviews')
export class AggregatedReviewEntity extends BaseEntity {
  @PrimaryColumn()
  serviceId: string;

  @Column({ type: 'decimal' })
  avgRating: number;

  @Column({ type: 'int' })
  count: number;
}
