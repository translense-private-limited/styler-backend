import { IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { OrderItemInterface } from "../interfaces/order-item.interface";

export class OrderItemDto implements OrderItemInterface{ 
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