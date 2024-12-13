import { IsNotEmpty } from "class-validator";

export class OrderConfirmationDto{
    @IsNotEmpty()
    accept: string[];

    @IsNotEmpty()
    reject:string[];

    @IsNotEmpty()
    reasonForRejection:string;
}