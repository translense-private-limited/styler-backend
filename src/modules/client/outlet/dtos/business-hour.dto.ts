import {
  IsNotEmpty,
  IsBoolean,
  IsString,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DayOfWeekEnum } from '@src/utils/enums/day-of-week.enum';

class DailyScheduleDto {
  @IsString()
  @IsNotEmpty()
  openingTime: string;

  @IsString()
  @IsNotEmpty()
  closingTime: string;

  @IsBoolean()
  isClosed: boolean;
}

class WeeklyScheduleDto {
  @IsObject()
  @ValidateNested({ each: true }) // Ensure nested validation
  @Type(() => DailyScheduleDto)
  [DayOfWeekEnum.MONDAY]: DailyScheduleDto;

  @ValidateNested()
  @Type(() => DailyScheduleDto)
  [DayOfWeekEnum.TUESDAY]: DailyScheduleDto;

  @ValidateNested()
  @Type(() => DailyScheduleDto)
  [DayOfWeekEnum.WEDNESDAY]: DailyScheduleDto;

  @ValidateNested()
  @Type(() => DailyScheduleDto)
  [DayOfWeekEnum.THURSDAY]: DailyScheduleDto;

  @ValidateNested()
  @Type(() => DailyScheduleDto)
  [DayOfWeekEnum.FRIDAY]: DailyScheduleDto;

  @ValidateNested()
  @Type(() => DailyScheduleDto)
  [DayOfWeekEnum.SATURDAY]: DailyScheduleDto;

  @ValidateNested()
  @Type(() => DailyScheduleDto)
  [DayOfWeekEnum.SUNDAY]: DailyScheduleDto;
}

export class BusinessHourDto {
  @IsNotEmpty()
  outletId: number;

  @IsObject()
  @ValidateNested()
  @Type(() => WeeklyScheduleDto) // Correctly maps to the new class
  weeklySchedule: WeeklyScheduleDto;
}
