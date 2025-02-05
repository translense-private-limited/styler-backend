import { BaseEntity } from '@src/utils/entities/base.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class customerCouponRedemption extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => Coupon, { onDelete: 'CASCADE' })
  // coupon: Coupon;

  // @ManyToOne(() => User, { onDelete: 'CASCADE' })
  // user: User;

  // @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  // order: Order;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  redeemedAt: Date;
}
