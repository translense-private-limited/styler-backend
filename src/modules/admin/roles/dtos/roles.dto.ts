import { IsString, IsNotEmpty, IsOptional, IsEmail, IsDecimal, IsNumber } from 'class-validator';

export class CreaterolesDto {
    @IsNotEmpty()
    @IsString()
    name: string; // Required field

    @IsNotEmpty()
    @IsNumber()
    isSystemDefined: boolean; // Required field

    @IsNotEmpty()
    @IsNumber()
    outletId: number; // Required field
}