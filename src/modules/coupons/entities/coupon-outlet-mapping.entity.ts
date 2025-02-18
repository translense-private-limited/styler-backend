import { BaseEntity } from '@src/utils/entities/base.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CouponEntity } from './coupon.entity';
import { OutletEntity } from '@modules/client/outlet/entities/outlet.entity';
import { CouponActionEnum } from '../enums/coupon-action.enum';

@Entity('coupon_outlet_mapping')
export class CouponOutletMappingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // this will create a column called couponId in coupon_outlet_mapping table
  @ManyToOne(() => CouponEntity, (coupon) => coupon.id, { onDelete: 'CASCADE' })
  coupon: CouponEntity;

  // this will create a column called outletId in coupon_outlet_mapping table
  @ManyToOne(() => OutletEntity, (outlet) => outlet.id, { onDelete: 'CASCADE' })
  outlet: OutletEntity;

  @DeleteDateColumn() // This column will be updated on soft delete
  deletedAt?: Date;

  @Column({
    type: 'enum',
    enum: CouponActionEnum,
  })
  status: CouponActionEnum;
}
