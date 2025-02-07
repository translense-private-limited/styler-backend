import { DiscountTypeEnum } from '../enums/discount-type.enum';
import { CouponTypeEnum } from '../enums/coupon-type.enum';

export interface CouponInterface {
  id: number;
  code: string;
  discountType: DiscountTypeEnum;
  discountValue: number;
  minOrderValue?: number;
  maximumDiscountCapping?: number;
  globalRedemptionLimit?: number;
  perUserRedemptionLimit?: number;
  validFrom: Date;
  validTo: Date;
  couponType: CouponTypeEnum;
  isActive: boolean;
}
