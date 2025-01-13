import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ServiceInterface } from '../interfaces/service.interface';
import { GenderEnum } from '@src/utils/enums/gender.enums';
import { Types } from 'mongoose';
import { IsObjectId } from '@src/utils/validators/is-object-id.validator';
import { SubtypeDto } from './subtype.dto';
import { Type } from 'class-transformer';

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

  @IsOptional()
  serviceImages?:string[];

  @IsOptional()
  serviceVideos?:string[];

  @ValidateNested({ each: true })
  @Type(() => SubtypeDto)
  @IsOptional()
  subtypes?: SubtypeDto[];
}
