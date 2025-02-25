import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ApplicableCouponsDto {
    @ApiProperty({ description: 'Customer ID', example: 123 })
    @IsNumber()
    customerId: number;

    @ApiProperty({ description: 'Outlet ID', example: 456 })
    @IsNumber()
    outletId: number;

    @ApiProperty({ description: 'Total Price of the order', example: 500 })
    @IsNumber()
    totalPrice: number;
}
