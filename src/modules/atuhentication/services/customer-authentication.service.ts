import { CustomerLoginResponseInterface } from './../interfaces/customer-login-response.interface';
import { CustomerTokenPayloadDto } from './../dtos/customer-token-payload.dto';

import { CustomerSignupDto } from '../dtos/customer-signup.dto';
import { CustomerExternalService } from './../../customer/services/customer-external.service';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { BcryptEncryptionService } from '@modules/encryption/services/bcrypt-encryption.service';
import { CustomerDto } from '@modules/customer/dtos/customer.dto';
import { CustomerTokenPayloadInterface } from '../interfaces/customer-token-payload.interface';
import { JwtService } from './jwt.service';

@Injectable()
export class CustomerAuthenticationService {
  constructor(
    private customerExternalService: CustomerExternalService,
    private bcryptEncryptionService: BcryptEncryptionService,
    private jwtService: JwtService,
  ) {}

  async registerCustomer(
    customerSignupDto: CustomerSignupDto,
  ): Promise<CustomerLoginResponseInterface> {
    // check the email otp
    // check the contact number otp
    // if all is fine
    // check the uniqueness of email and contact number
    const customerByContactNumber =
      await this.customerExternalService.getCustomerByContactNumber(
        +customerSignupDto.contactNumber,
      );

    const customerByEmail =
      await this.customerExternalService.getCustomerByEmail(
        customerSignupDto.email,
      );

    if (customerByContactNumber || customerByEmail) {
      throw new ConflictException(
        `Customer already exists with provided email or contact number , please choose unique details`,
      );
    }

    // encrypt the password and create customer
    const customer = await this.customerExternalService.save(customerSignupDto);

    const tokenPayload = await this.constructJwtPayload(customer);

    const token = this.jwtService.generateToken(tokenPayload);

    return {
      token,
      customer,
    };
  }

  async constructJwtPayload(
    customer: CustomerDto,
  ): Promise<CustomerTokenPayloadInterface> {
    const tokenPayload: CustomerTokenPayloadDto = {
      name: customer.name,
      email: customer.email,
      contactNumber: customer.contactNumber,
    };
    return tokenPayload;
  }

  async customerLogin(
    loginDto: LoginDto,
  ): Promise<CustomerLoginResponseInterface> {
    const { username, password } = loginDto;
    const customer =
      await this.customerExternalService.getCustomerByEmailOrContactNumber(
        username,
      );
    const isValid = await this.bcryptEncryptionService.validate(
      password,
      customer.password,
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    // prepare the jwt and pass in body
    const tokenPayload = this.constructJwtPayload(customer);

    // encrypt token
    const token = this.jwtService.generateToken(tokenPayload);

    // remove password from
    delete customer.password;

    return {
      token,
      customer,
    };
  }
}
