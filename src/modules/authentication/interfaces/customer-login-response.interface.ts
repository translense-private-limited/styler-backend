import { CustomerDto } from '@modules/customer/dtos/customer.dto';

export interface CustomerLoginResponseInterface {
  customer: Omit<CustomerDto, 'password'>;
  token: string;
}
