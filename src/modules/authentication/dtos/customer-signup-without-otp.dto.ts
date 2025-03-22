import { OmitType } from '@nestjs/mapped-types';
import { CustomerSignupDto } from './customer-signup.dto';

export class CustomerSignupWithoutOtpDto extends OmitType(CustomerSignupDto, ['emailOtp', 'contactNumberOtp'] as const) { }
