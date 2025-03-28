import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsNumberString,
    Length,
    MinLength,
  } from 'class-validator';
import { AdminSignupInterface } from '../interfaces/admin-signup.interface';
  
  export class AdminSignupDto implements AdminSignupInterface {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters long.' })
    password: string;
  
    @IsNumberString()
    @Length(9,11) // Assuming a valid contact number is 10 digits
    contactNumber: number;

  }
  