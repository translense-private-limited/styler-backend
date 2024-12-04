import { IsDate, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentInterface } from '../interfaces/appointment.interface';

/**
 * DTO for updating the appointment time.
 * Implements the AppointmentInterface, omitting unnecessary fields.
 */
export class UpdateAppointmentTimeDto
  implements
    Omit<
      AppointmentInterface,
      'appointmentId' | 'status' | 'customerId' | 'outletId' | 'endTime'
    >
{
  /**
   * The updated start time of the appointment.
   */
  @IsDate()
  @ApiProperty({
    description: 'The updated start time of the appointment',
    example: '2024-12-04T10:00:00Z',
  })
  startTime: Date;

  @IsNumber()
  orderId: number;
}
