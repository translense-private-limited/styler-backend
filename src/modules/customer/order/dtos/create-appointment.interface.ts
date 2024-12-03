import { IsNotEmpty, IsEnum, IsOptional, IsDate, IsInt } from 'class-validator';
import { AppointmentInterface } from '../interfaces/appointment.interface';
import { BookingStatusEnum } from '../enums/booking-status.enum';

export class CreateAppointmentDto
  implements
    Omit<
      AppointmentInterface,
      'appointmentId' | 'endTime' | 'actualStartTime' | 'actualEndTime'
    >
{
  @IsNotEmpty()
  @IsInt()
  orderId: number; // The ID of the order associated with this appointment

  @IsNotEmpty()
  @IsDate()
  startTime: Date; // The scheduled start time of the appointment

  @IsNotEmpty()
  @IsInt()
  outletId: number; // The ID of the outlet where the service is scheduled

  @IsNotEmpty()
  @IsInt()
  customerId: number; // The ID of the customer booking the appointment

  @IsOptional()
  @IsEnum(BookingStatusEnum)
  status: BookingStatusEnum = BookingStatusEnum.PENDING; // Default to 'PENDING'
}
