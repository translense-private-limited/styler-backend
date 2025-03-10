import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceWithDiscountDto } from './service-with-discount-dto';



export class CreatePackageDto {
    @IsString()
    packageName: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ServiceWithDiscountDto)
    services: ServiceWithDiscountDto[];

    @IsNumber()
    price: number; // Total price of the package

    @IsNumber()
    discount: number; // Total discount for the package

    @IsNumber()
    totalDuration: number; // Total duration of the package

    @IsNumber()
    outletId: number; // ID of the outlet

    @IsNumber()
    whitelabelId: number; // ID of the whitelabel
}