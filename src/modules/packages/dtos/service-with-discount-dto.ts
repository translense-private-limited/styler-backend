import { IsNumber, IsString } from "class-validator";

export class ServiceWithDiscountDto {
    @IsString()
    serviceId: string;

    @IsNumber()
    discount: number;
}