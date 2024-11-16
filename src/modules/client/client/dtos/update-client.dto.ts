import { GenderEnum } from '@src/utils/enums/gender.enums';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ClientInterface } from '../interfaces/client.interface';

export class UpdateClientDto implements Partial<ClientInterface> {
  @IsOptional()
  @IsString()
  @Length(1, 255, { message: 'Name must be between 1 and 255 characters' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  @Length(10, 15, { message: 'Contact number must be between 10 to 15 digits' })
  @Matches(/^\d+$/, { message: 'Contact number must contain only digits' })
  contactNumber?: string;

  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @IsEnum(GenderEnum, { message: 'Invalid gender value' })
  gender?: GenderEnum;

  @IsOptional()
  @IsNumber()
  pastExperience?: number;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsNumber()
  outletId?: number;
}
