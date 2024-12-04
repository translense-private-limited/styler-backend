import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CreateOrderPayloadInterface } from '../interfaces/create-order.interface';

import { TimeSlotDto } from './time-slot.dto';

import { OrderItemPayloadDto } from './order-item.dto';

export class OrderResponseDto
  extends TimeSlotDto
  implements CreateOrderPayloadInterface
{
  @IsNumber()
  orderId: number;

  @IsArray()
  @IsNotEmpty()
  orderItems: OrderItemPayloadDto[];

  @IsNotEmpty()
  outletId: number;

  @IsNotEmpty()
  @IsOptional()
  paymentId?: string;

  startTime: Date;

  endTime: Date;
}
