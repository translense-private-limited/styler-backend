import { IsArray, IsNotEmpty, } from "class-validator";
import { CreateOrderInterface } from "../interfaces/create-order.interface";
import { OrderedServicesDetailsDto } from "./ordered-services-details.dto";

export class CreateOrderDto implements CreateOrderInterface{
    @IsArray()
    @IsNotEmpty()
    services:OrderedServicesDetailsDto[]

    @IsNotEmpty()
    customerId:number;

    @IsNotEmpty()
    outletId:number;
    
    @IsNotEmpty()
    paymentId:string;
}