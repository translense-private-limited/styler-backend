import { ServiceInterface } from "@modules/client/services/interfaces/service.interface";
import { OrderItemInterface } from "./order-item.interface";

export interface OpenOrderResponseInterface extends Omit<OrderItemInterface, 'serviceId' | 'quantity' | 'outletId' | 'notes'> {
  orderId: number;
  amountPaid: number;
  services: ServiceDetailsInterface[];
  customer: {
    customerName: string;
    customerImage: string;
    customerContact: number;
    customerEmail: string;
  };
  appointment: {
    appointmentId: number;
    time: Date;
    endTime: Date;
    actualStartTime: Date;
    actualEndTime: Date;
  };
}

export interface ServiceDetailsInterface {
  serviceId: string; 
  serviceName: string; 
  price: number; 
}

export interface FetchOpenOrderInterface extends OrderItemInterface{
  appointmentId: number;
  startTime: Date;
  actualStartTime:Date;
  actualEndTime:Date;
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
