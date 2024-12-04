import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

/**
 * DTO representing a time slot for an appointment.
 */
export class TimeSlotDto {
  @ApiProperty({
    description: 'Start time of the time slot',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  startTime: Date;

  @ApiProperty({
    description: 'End time of the time slot',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  endTime: Date;
}
