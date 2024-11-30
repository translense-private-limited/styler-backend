import { OrderItemInterface } from "./order-item.interface";


export interface CreateOrderInterface {
  services: OrderItemInterface[];     
  customerId: number; 
  outletId:number;          
  paymentId?: string;            
}
