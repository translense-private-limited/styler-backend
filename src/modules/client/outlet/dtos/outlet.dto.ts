import { IsString, IsNotEmpty, IsOptional, IsEmail, IsDecimal, IsNumber } from 'class-validator';

export class CreateOutletDto {
    @IsNotEmpty()
    @IsString()
    name: string; // Required field

    @IsNotEmpty()
    @IsString()
    address: string; // Required field

    @IsNotEmpty()
    @IsNumber()
    latitude: number; // Required field

    @IsNotEmpty()
    @IsNumber()
    longitude: number; // Required field

    @IsNotEmpty()
    @IsString()
    phoneNumber: string; // Required field

    @IsNotEmpty()
    @IsEmail()
    email: string; // Required field

    @IsOptional()
    @IsString()
    website?: string; // Optional field

    @IsOptional()
    @IsString()
    description?: string; // Optional field
}