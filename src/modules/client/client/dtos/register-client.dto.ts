import { GenderEnum } from '@src/utils/enums/gender.enums';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
export class RegiseteClientDto {

    @IsNotEmpty({ message: 'Name should not be empty' })
    @Length(1, 255, { message: 'Name must be between 1 and 255 characters' })
    name: string;
  
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email should not be empty' })
    email: string;
  
    @IsString()
    password: string;
  
    @IsNotEmpty({ message: 'Contact number should not be empty' })
    @Length(10, 15, { message: 'Contact number must be between 10 to 15 digits' })
    @Matches(/^\d+$/, { message: 'Contact number must contain only digits' })
    contactNumber: string;
  
    @IsEnum(GenderEnum)
    @IsNotEmpty({ message: 'Gender should not be empty' })
    gender: GenderEnum;
  
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
  