import { IsArray, IsNotEmpty, } from "class-validator";
import { CreateOrderInterface } from "../interfaces/create-order.interface";
import { OrderItemDto } from "./order-item.dto";

export class CreateOrderDto implements CreateOrderInterface{
    @IsArray()
    @IsNotEmpty()
    services:OrderItemDto[]

    @IsNotEmpty()
    customerId:number;

    @IsNotEmpty()
    outletId:number;
    
    @IsNotEmpty()
    paymentId:string;
}