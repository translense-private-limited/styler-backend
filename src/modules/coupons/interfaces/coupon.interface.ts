import { DiscountTypeEnum } from '../enums/discount-type.enum';
import { CouponTypeEnum } from '../enums/coupon-type.enum';
import { ClientEntity } from '@modules/client/client/entities/client.entity';

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
  createdByClient?: ClientEntity | null;
}
