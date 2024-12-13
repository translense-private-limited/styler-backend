import { IsDateString, IsOptional } from "class-validator";
import { BookingStatusEnum } from "../enums/booking-status.enum";

export class OrderFilterDto{
    @IsDateString()
    startTime:Date;

    @IsDateString()
    endTime:Date;

    @IsOptional()
    appointmentStatus?:BookingStatusEnum;
}