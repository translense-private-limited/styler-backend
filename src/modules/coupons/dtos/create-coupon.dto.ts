import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  IsDate,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DiscountTypeEnum } from '../enums/discount-type.enum';
import { CouponTypeEnum } from '../enums/coupon-type.enum';
import { CouponInterface } from '../interfaces/coupon.interface';
import { ClientEntity } from '@modules/client/client/entities/client.entity';
export class CreateCouponDto implements Omit<CouponInterface, 'id'> {
  @IsString()
  code: string;

  @IsEnum(DiscountTypeEnum)
  discountType: DiscountTypeEnum;

  @IsNumber()
  discountValue: number;

  @IsOptional()
  @IsNumber()
  minOrderValue?: number;

  @IsOptional()
  @IsNumber()
  maximumDiscountCapping?: number;

  @IsOptional()
  @IsInt()
  globalRedemptionLimit?: number;

  @IsOptional()
  @IsInt()
  perUserRedemptionLimit?: number;

  @Type(() => Date)
  @IsDate()
  validFrom: Date;

  @Type(() => Date)
  @IsDate()
  validTo: Date;

  @IsEnum(CouponTypeEnum)
  couponType: CouponTypeEnum;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  createdByClient?: ClientEntity | null;
}
