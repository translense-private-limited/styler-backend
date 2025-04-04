import { BaseEntity } from '@src/utils/entities/base.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('aggregrate_reviews')
export class AggregatedRatingEntity extends BaseEntity {
  @PrimaryColumn()
  serviceId: string;

  @Column({ type: 'decimal' })
  avgRating: number;

  @Column({ type: 'int' })
  count: number;
}
