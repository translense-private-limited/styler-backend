import { IsNumber, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class OrderDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amountPaid: number;

  @IsNumber()
  @IsOptional()
  paymentId?: string;

  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @IsNumber()
  @IsNotEmpty()
  outletId:number
}
