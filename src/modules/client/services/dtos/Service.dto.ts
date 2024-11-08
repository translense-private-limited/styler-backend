import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { serviceInterface } from "../interfaces/service.interface";
import { Gender } from "../interfaces/service.interface";

export class ServiceDto implements serviceInterface {
    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @IsString()
    @IsNotEmpty()
    categoryName:string;

    @IsEnum(Gender)
    @IsNotEmpty()
    gender: Gender;

    @IsString()
    @IsNotEmpty()
    serviceName: string;

    @IsString()
    @IsNotEmpty()  
    type: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    timeTaken: number;

    @IsString()
    @IsNotEmpty()
    about: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
