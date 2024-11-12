import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ServiceInterface } from '../interfaces/service.interface';
import { GenderEnum } from '@src/utils/enums/gender.enums';

export class ServiceDto implements ServiceInterface {
  @IsString()
  @IsNotEmpty()
  categoryId: string;

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
  @IsNotEmpty()
  timeTaken: number;

  @IsString()
  @IsNotEmpty()
  about: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
