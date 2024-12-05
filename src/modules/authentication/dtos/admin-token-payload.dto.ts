import { IsString, IsEmail, IsNumber, IsNotEmpty } from 'class-validator';
import { AdminTokenPayloadInterface } from '../interfaces/admin-token-payload.interface';

export class CustomerTokenPayloadDto implements AdminTokenPayloadInterface {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  contactNumber: number;
}
