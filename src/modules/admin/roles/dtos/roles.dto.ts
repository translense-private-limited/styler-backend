import { IsString, IsNotEmpty, IsOptional, IsEmail, IsDecimal, IsNumber, IsBoolean } from 'class-validator';

export class CreaterolesDto {
    @IsNotEmpty()
    @IsString()
    name: string; // Required field

    @IsBoolean()
    isSystemDefined: boolean; // Required field

    @IsNotEmpty()
    @IsNumber()
    outletId: number; // Required field
}