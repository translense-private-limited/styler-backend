import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  @Type(()=>Date)
  @IsDate()
  startTime: Date;

  @ApiProperty({
    description: 'End time of the time slot',
    type: String,
    format: 'date-time',
  })
  @Type(()=>Date)
  @IsDate()
  endTime: Date;
}
