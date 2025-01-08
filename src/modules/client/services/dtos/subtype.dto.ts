import { IsOptional, IsString, IsNumber, IsPositive } from 'class-validator';

export class SubtypeDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  price?: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  timeTaken?: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  discount?: number;
  
  @IsString()
  @IsOptional()
  description?: string;
}