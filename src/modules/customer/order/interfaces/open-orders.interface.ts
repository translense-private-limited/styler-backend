import { ServiceInterface } from "@modules/client/services/interfaces/service.interface";
import { OrderItemInterface } from "./order-item.interface";

export interface OpenOrderResponseInterface extends Omit<OrderItemInterface, 'serviceId' | 'quantity'|'outletId'|'notes'> {
  orderId: number;
  amountPaid: number; 
  services: ServiceDetailsInterface[];
  time: Date; 
  customerName: string; 
  customerImage: string; 
  contact: number; 
  email: string; 
}

export interface ServiceDetailsInterface {
  serviceId: string; 
  serviceName: string; 
  price: number; 
}

export interface FetchOpenOrderInterface extends OrderItemInterface{
  appointmentId: number;
  startTime: Date;
  endTime: Date;
  orderId: number;
  updatedAt: Date;
  amountPaid: number;
  customerName: string; 
  customerContact: number;
  customerEmail: string;
}

export interface FormattedServiceDetailsInterface extends Omit<ServiceInterface,'categoryId'|'gender'>{
  serviceId:string,
  discount:number,
  quantity:number,
  notes:string
}
