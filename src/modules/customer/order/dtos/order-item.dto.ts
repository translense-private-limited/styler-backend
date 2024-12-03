import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { OrderItemInterface } from '../interfaces/order-item.interface';

export class OrderItemPayloadDto
  implements Omit<OrderItemInterface, 'orderId'>
{
  @IsNotEmpty()
  @IsUUID()
  serviceId: string;

  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  outletId?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
