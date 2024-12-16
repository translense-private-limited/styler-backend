import { AddressDto } from '@src/utils/dtos/address.dto';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsNumber,
} from 'class-validator';

export class CreateOutletDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsOptional()
  @IsString()
  description?: string; 

  // @IsOptional()
  // @IsNumber()
  // addressId: number; // Required field

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

  @IsNotEmpty()
  address:AddressDto;

}
