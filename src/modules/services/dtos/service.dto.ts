import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ServiceInterface } from '../interfaces/service.interface'; // Adjust the import path as needed

export class ServiceDto implements ServiceInterface {
  @IsString()
  @IsNotEmpty()
  name: string; // e.g., Haircut, Facial

  @IsString()
  @IsOptional()
  description?: string; // Description of the service

  @IsNumber()
  @IsNotEmpty()
  category: number; // Category of the service

  @IsNumber()
  @IsNotEmpty()
  price: number; // Price of the service

  @IsNumber()
  @IsNotEmpty()
  duration: number; // Duration in minutes (for time-based services)

  @IsNumber()
  @IsNotEmpty()
  clientId: number; // Client ID associated with the service

  
}