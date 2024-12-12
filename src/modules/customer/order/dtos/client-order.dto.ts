import { IsDateString } from 'class-validator';

export class ClientOrderDto {
  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;
}
