import { OrderStatusEnum } from '../enums/order-status.enum';

export interface OrderInterface {
  amountPaid: number;
  paymentId?: string;
  customerId: number;
  outletId: number;
  status?: OrderStatusEnum;
}
