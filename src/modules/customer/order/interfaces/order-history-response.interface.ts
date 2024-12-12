import { BookingStatusEnum } from "../enums/booking-status.enum";

export interface OrderHistoryResponseInterface {
    customerName: string;
    orderId: string;
    time: string;
    amountPaid: number;
    status: BookingStatusEnum;
  }
  