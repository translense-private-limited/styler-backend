import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumberString,
  Length,
  MinLength,
} from 'class-validator';

export class CustomerSignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;

  @IsNumberString()
  @IsNotEmpty()
  emailOtp: number; // OTP for email verification

  @IsNumberString()
  @Length(9,11) // Assuming a valid contact number is 10 digits
  contactNumber: number; // Use string type for phone number

  @IsNumberString()
  @IsNotEmpty()
  contactNumberOtp: number; // OTP for contact number verification

  @IsString()
  @IsNotEmpty()
  name: string;
}
