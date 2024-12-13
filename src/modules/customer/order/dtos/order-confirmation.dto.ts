import { IsNotEmpty, IsOptional } from "class-validator";

export class OrderConfirmationDto{
    @IsNotEmpty()
    accept: string[];

    @IsNotEmpty()
    reject:string[];

    @IsOptional()
    reasonForRejection:string;
}