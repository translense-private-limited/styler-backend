import { OrderItemInterface } from "./order-item.interface";


export interface CreateOrderInterface {
  orderItems: OrderItemInterface[];     
  customerId: number; 
  outletId:number;          
  paymentId?: string;            
}
