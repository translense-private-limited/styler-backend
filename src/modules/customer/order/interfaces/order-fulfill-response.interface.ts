import { PaymentModeEnum } from "../enums/payment-mode.enum";

export interface FulfillOrderResponseInterface {
    orderId: number;
    otp: number;
    paymentMode: PaymentModeEnum;
    amountReceived: number;
  }
  