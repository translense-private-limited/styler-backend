import { IsArray, IsNotEmpty, } from "class-validator";
import { CreateOrderInterface } from "../interfaces/create-order.interface";
import { OrderItemPayloadDto } from "./order-item.dto";

export class CreateOrderDto implements CreateOrderInterface{
    @IsArray()
    @IsNotEmpty()
    orderItems:OrderItemPayloadDto[]

    @IsNotEmpty()
    customerId:number;

    @IsNotEmpty()
    outletId:number;
    
    @IsNotEmpty()
    paymentId:string;
}