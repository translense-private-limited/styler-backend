import { GenderEnum } from '@src/utils/enums/gender.enums';
import { CustomerInterface } from '../interfaces/customer.interface';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CustomerDto implements CustomerInterface {

  @IsNotEmpty()
  id:number;
  
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNumber({}, { message: 'Contact number must be a number' })
  contactNumber: number;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsEnum(GenderEnum, { message: 'Invalid gender value' })
  @IsOptional()
  gender?: GenderEnum;
}
