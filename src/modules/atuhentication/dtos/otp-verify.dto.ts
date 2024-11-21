import { IsString, IsNumber } from 'class-validator';

export class OtpVerifyDto {
  @IsString()
  recipient: string;

  @IsNumber()
  otp: number;
}
