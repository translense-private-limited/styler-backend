import { IsArray, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, Length } from 'class-validator';
import { CreateOrderPayloadInterface } from '../interfaces/create-order.interface';
import { OrderItemPayloadDto } from './order-item.dto';

export class CreateWalkInCustomerOrderDto implements CreateOrderPayloadInterface {
    @IsArray()
    @IsNotEmpty()
    orderItems: OrderItemPayloadDto[];

    @IsNotEmpty()
    outletId: number;

    @IsNotEmpty()
    @IsOptional()
    paymentId?: string;

    @IsNotEmpty()
    startTime: Date;

    @IsNotEmpty()
    endTime?: Date;

    @IsEmail()
    @IsNotEmpty()
    email: string;


    @IsNumberString()
    @Length(9, 11)
    contactNumber: number;


    @IsString()
    @IsNotEmpty()
    name: string;
}
