import { IsNotEmpty, IsNumber } from 'class-validator';
import { PaymentModeEnum } from '../enums/payment-mode.enum';

export class FulfillOrderDto {
    @IsNumber()
    otp: number;
  
    @IsNotEmpty()
    paymentMode: PaymentModeEnum;
  
    @IsNumber()
    @IsNotEmpty()
    amountReceived: number;
}
