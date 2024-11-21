import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumberString,
  Length,
} from 'class-validator';

export class CustomerSignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumberString()
  @IsNotEmpty()
  emailOtp: number; // OTP for email verification

  @IsNumberString()
  @Length(10, 10) // Assuming a valid contact number is 10 digits
  contactNumber: number; // Use string type for phone number

  @IsNumberString()
  @IsNotEmpty()
  contactNumberOtp: number; // OTP for contact number verification

  @IsString()
  @IsNotEmpty()
  name: string;
}
