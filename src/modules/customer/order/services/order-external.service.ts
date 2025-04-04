import { Injectable } from '@nestjs/common';

import { OrderEntity } from '../entities/orders.entity';
import { OrderService } from './order.service';

@Injectable()
export class OrderExternalService {
  constructor(private orderService: OrderService) {}
  async getOrderDetails(
    orderId: number,
    customerId: number,
  ): Promise<OrderEntity | null> {
    return await this.orderService.getOrderByOrderAndCustomerId(
      orderId,
      customerId,
    );
  }
}
