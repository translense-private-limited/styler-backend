import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  /**
   * The recipient to whom the OTP was sent (email or contact number).
   */
  @IsNotEmpty()
  @IsString()
  recipient: string;

  /**
   * The OTP provided by the user for verification.
   */
  @IsNotEmpty()
  @IsNumber()
  otp: number;

  /**
   * The new password to set for the user.
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  password: string;
}
