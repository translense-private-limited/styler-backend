import { OrderedServicesDetailsInterface } from "./ordered-services-details.interface";


export interface CreateOrderInterface {
  services: OrderedServicesDetailsInterface[];     
  customerId: number; 
  outletId:number;          
  paymentId: string;            
}
