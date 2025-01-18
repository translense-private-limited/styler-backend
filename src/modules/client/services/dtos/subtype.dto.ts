import { GenderEnum } from '@src/utils/enums/gender.enums';
import { IsOptional, IsString, IsNumber, IsPositive } from 'class-validator';

export class SubtypeDto {
  @IsString()
  name: string;

  @IsOptional()
  gender:GenderEnum;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  timeTaken: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  discount?: number;
  
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  about?: string;

  @IsOptional()
  subtypeImage:string;
  
}