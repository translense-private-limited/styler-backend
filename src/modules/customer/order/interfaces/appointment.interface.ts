import { BookingStatusEnum } from '../enums/booking-status.enum';

export interface AppointmentInterface {
  appointmentId: number;
  orderId: number;
  startTime: Date;
  endTime: Date;
  outletId: number;
  customerId: number;
  status: BookingStatusEnum;
  actualStartTime?: Date;
  actualEndTime?: Date;
}
