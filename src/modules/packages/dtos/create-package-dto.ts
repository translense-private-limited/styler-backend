import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
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
    price: number;

    @IsOptional()
    @IsNumber()
    discount?: number;

    @IsNumber()
    totalDuration: number;
    @IsNumber()
    outletId: number;

    @IsNumber()
    whitelabelId: number;
}