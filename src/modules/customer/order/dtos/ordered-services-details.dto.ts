import { IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { OrderedServicesDetailsInterface } from "../interfaces/ordered-services-details.interface";

export class OrderedServicesDetailsDto implements OrderedServicesDetailsInterface{ 
    @IsNotEmpty()
    @IsUUID()
    serviceId:string;

    @IsNotEmpty()
    startTime:Date;

    @IsOptional()
    endTime?:Date;

    @IsNotEmpty()
    @IsPositive()
    quantity:number;

    @IsNotEmpty()
    outletId:number;

    @IsOptional()
    @IsString()
    notes?:string;
}