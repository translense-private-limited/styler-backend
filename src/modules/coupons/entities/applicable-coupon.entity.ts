import { IsBoolean } from "class-validator";
import { CouponEntity } from "./coupon.entity";

export class ApplicableCouponEntity extends CouponEntity {

    @IsBoolean()
    applicable: boolean;
}