import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateOrderPayloadInterface } from '../interfaces/create-order.interface';
import { OrderItemPayloadDto } from './order-item.dto';
import { TimeSlotDto } from './time-slot.dto';

export class CreateOrderDto
  extends TimeSlotDto
  implements CreateOrderPayloadInterface
{
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
