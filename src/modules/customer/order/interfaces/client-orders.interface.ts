import { OrderItemInterface } from "./order-item.interface";
import { ServiceSchema } from "@modules/client/services/schema/service.schema";
import { BookingStatusEnum } from "../enums/booking-status.enum";
import { OrderStatusEnum } from "../enums/order-status.enum";

export interface OrderResponseInterface extends Omit<OrderItemInterface, 'serviceId'| 'outletId'> {
  orderId: number;
  amountPaid: number;
  orderStatus:OrderStatusEnum;
  services: ServiceDetailsInterface[];
  customer: {
    customerId:number;
    customerName: string;
    customerImage: string;
    customerContact: number;
    customerEmail: string;
  };
  appointment: {
    appointmentId: number;
    startTime: Date;
    endTime: Date;
    BookingStatus:BookingStatusEnum;
  };
}

export interface ServiceDetailsInterface extends ServiceSchema{
  quantity:number;
    notes?:string;
}
export interface OrderDetailsInterface extends OrderItemInterface {
  appointmentId: number;
  startTime: Date;
  endTime: Date;
  status:BookingStatusEnum;
  outletId:number
  orderId: number;
  updatedAt: Date;
  amountPaid: number;
  orderStatus: OrderStatusEnum;
  otp:number;
  customerId:number;
  customerName: string;
  customerContact: string;
  customerEmail: string;
  quantity: number;
  discount: number;  
  notes?: string;     
}
