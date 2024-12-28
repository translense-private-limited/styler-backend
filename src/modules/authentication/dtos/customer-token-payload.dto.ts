import { IsString, IsEmail, IsNumber, IsNotEmpty } from 'class-validator';
import { CustomerTokenPayloadInterface } from '../interfaces/customer-token-payload.interface';

export class CustomerTokenPayloadDto implements CustomerTokenPayloadInterface {
  
  @IsNotEmpty()
  customerId:number;
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  contactNumber: number;
}
