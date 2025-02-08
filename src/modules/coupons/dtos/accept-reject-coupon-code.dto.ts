import { IsEnum, IsNumber } from 'class-validator';
import { CouponActionEnum } from '../enums/coupon-action.enum';

export class AcceptRejectCouponCodeDto {
  @IsNumber()
  outletId: number;

  @IsNumber()
  couponCodeId: number;

  @IsEnum(CouponActionEnum)
  flag: CouponActionEnum;
}
