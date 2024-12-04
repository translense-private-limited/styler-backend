import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateOrderPayloadInterface } from '../interfaces/create-order.interface';
import { OrderItemPayloadDto } from './order-item.dto';

export class CreateOrderDto implements CreateOrderPayloadInterface {
  @IsArray()
  @IsNotEmpty()
  orderItems: OrderItemPayloadDto[];

  @IsNotEmpty()
  outletId: number;

  @IsNotEmpty()
  @IsOptional()
  paymentId?: string;

  @IsNotEmpty()
  startTime: Date;

  @IsNotEmpty()
  endTime:Date;
}
