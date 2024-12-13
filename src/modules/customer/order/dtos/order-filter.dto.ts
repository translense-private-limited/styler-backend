import { IsDateString, IsOptional } from "class-validator";
import { BookingStatusEnum } from "../enums/booking-status.enum";

export class OrderFilterDto{
    @IsOptional()
    @IsDateString()
    startTime:Date;

    @IsOptional()
    @IsDateString()
    endTime:Date;

    @IsOptional()
    appointmentStatus?:BookingStatusEnum;
}