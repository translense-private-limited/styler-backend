import { ServiceSchema } from '@modules/client/services/schema/service.schema';
import { OrderItemInterface } from './order-item.interface'; // Import the base interface

export interface ExpandedOrderItemInterface
  extends Omit<OrderItemInterface, 'serviceId' | 'orderId'> {
  quantity: number;
  outletId: number;
  notes?: string;
  service: ServiceSchema;
}
