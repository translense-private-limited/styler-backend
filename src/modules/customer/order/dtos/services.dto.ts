import { IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { ServicesInterface } from "../interfaces/services.interface";

export class ServicesDto implements ServicesInterface{ 
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