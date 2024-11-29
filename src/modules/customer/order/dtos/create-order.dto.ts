import { IsArray, IsNotEmpty, } from "class-validator";
import { ServicesDto } from "./services.dto";
import { CreateOrderInterface } from "../interfaces/create-order.interface";

export class CreateOrderDto implements CreateOrderInterface{
    @IsArray()
    @IsNotEmpty()
    services:ServicesDto[]

    @IsNotEmpty()
    customerId:number;

    @IsNotEmpty()
    paymentId:string;
}