import { IsBoolean } from "class-validator";
import { CouponEntity } from "../entities/coupon.entity";

export class ApplicableCouponDto extends CouponEntity {

    @IsBoolean()
    applicable: boolean;
}