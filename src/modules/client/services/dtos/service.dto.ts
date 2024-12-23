import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { ServiceInterface } from '../interfaces/service.interface';
import { GenderEnum } from '@src/utils/enums/gender.enums';
import { Types } from 'mongoose';
import { IsObjectId } from '@src/utils/validators/is-object-id.validator';

export class ServiceDto implements ServiceInterface {
  @Validate(IsObjectId) // Custom validator to check ObjectId format
  @IsNotEmpty()
  categoryId: Types.ObjectId;

  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender: GenderEnum;

  @IsString()
  @IsNotEmpty()
  serviceName: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  discount?:number

  @IsNumber()
  @IsNotEmpty()
  timeTaken: number;

  @IsString()
  @IsNotEmpty()
  about: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  outletId: number;
}
