import { CustomerTokenPayloadInterface } from '@modules/authentication/interfaces/customer-token-payload.interface';

export class CustomerDecoratorDto implements CustomerTokenPayloadInterface {
  customerId: number;
  whitelabelId: number;
  name: string;
  email: string;
  contactNumber: number;
}
