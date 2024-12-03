import { OrderItemInterface } from './order-item.interface';

export interface CreateOrderPayloadInterface {
  orderItems: Omit<OrderItemInterface, 'orderId'>[];

  outletId: number;
  paymentId?: string;
}
