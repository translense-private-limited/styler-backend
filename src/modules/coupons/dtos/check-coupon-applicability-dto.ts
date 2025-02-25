import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckCouponApplicabilityDto {
    @ApiProperty({ description: 'Coupon ID', example: 123 })
    @IsNumber()
    couponId: number;

    @ApiProperty({ description: 'Total price of the order', example: 500 })
    @IsNumber()
    totalPrice: number;

    @ApiProperty({ description: 'Customer ID placing the order', example: 789 })
    @IsNumber()
    customerId: number;

    @ApiProperty({ description: 'Outlet ID where the order is placed', example: 456 })
    @IsNumber()
    outletId: number;
}
