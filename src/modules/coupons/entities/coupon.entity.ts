import { BaseEntity } from '@src/utils/entities/base.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiscountTypeEnum } from '../enums/discount-type.enum';
import { CouponTypeEnum } from '../enums/coupon-type.enum';

@Entity()
export class CouponEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // Unique coupon code

  @Column({
    type: 'enum',
    enum: DiscountTypeEnum,
    default: 'PERCENTAGE',
  })
  discountType: DiscountTypeEnum; // Type of discount

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountValue: number; // Discount amount or percentage

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minOrderValue: number; // Minimum order value (if applicable)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maximumDiscountCapping: number; // maximum discount (if applicable)

  @Column({ type: 'int', nullable: true })
  globalRedemptionLimit: number; // Global limit on total redemptions

  @Column({ type: 'int', nullable: true })
  perUserRedemptionLimit: number; // Max times a single user can use

  @Column({ type: 'timestamp' })
  validFrom: Date;

  @Column({
    type: 'enum',
    enum: CouponTypeEnum,
    default: CouponTypeEnum.ONE_TIME,
  })
  couponType: CouponTypeEnum;

  @Column({ type: 'timestamp' })
  validTo: Date;

  @Column({ default: true })
  isActive: boolean; // To deactivate coupons

  @ManyToOne(() => Client, (client) => client.coupons, { nullable: true })
  createdByClient: Client | null; // Can be null if created by admin
}
