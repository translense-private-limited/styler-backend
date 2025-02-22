import { IsNumber } from "class-validator";

export class CheckDiscountDto {
    @IsNumber()
    couponId: number;

    @IsNumber()
    totalPrice: number;
}