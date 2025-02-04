import { BaseEntity } from '@src/utils/entities/base.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CouponOutletMappingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Coupon, (coupon) => coupon.id, { onDelete: 'CASCADE' })
  coupon: Coupon;

  @ManyToOne(() => Outlet, (outlet) => outlet.id, { onDelete: 'CASCADE' })
  outlet: Outlet;
}
