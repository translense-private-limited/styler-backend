import { DiscountTypeEnum } from '../enums/discount-type.enum';
import { CouponTypeEnum } from '../enums/coupon-type.enum';
import { UserTypeEnum } from '@src/utils/enums/user-type.enum';

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
  owner: UserTypeEnum.ADMIN | UserTypeEnum.CLIENT;
  couponType: CouponTypeEnum;
  isActive: boolean;
}
