import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class ApplicableCouponsDto {
    @ApiProperty({ description: 'Customer ID', example: 123 })
    @Transform(({ value }) => Number(value))
    @IsNumber()
    customerId: number;

    @ApiProperty({ description: 'Outlet ID', example: 456 })
    @Transform(({ value }) => Number(value))
    @IsNumber()
    outletId: number;

    @ApiProperty({ description: 'Total Price of the order', example: 500 })
    @Transform(({ value }) => Number(value))
    @IsNumber()
    totalPrice: number;
}
