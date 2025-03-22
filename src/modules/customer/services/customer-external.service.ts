import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerEntity } from '../entities/customer.entity';
import { CustomerSignupDto } from '@modules/authentication/dtos/customer-signup.dto';
import { CustomerSignupWithoutOtpDto } from '@modules/authentication/dtos/customer-signup-without-otp.dto';
import { BcryptEncryptionService } from '@modules/encryption/services/bcrypt-encryption.service';
import { CustomerRepository } from '../repositories/customer.repository';

@Injectable()
export class CustomerExternalService {
  constructor(private customerService: CustomerService,
    private bcryptEncryptionService: BcryptEncryptionService,
    private customerRepository: CustomerRepository,
  ) { }

  async getCustomerByEmail(email: string): Promise<CustomerEntity> {
    return this.customerService.getCustomerByEmailId(email);
  }

  async getCustomerByContactNumber(
    contactNumber: number,
  ): Promise<CustomerEntity> {
    return this.customerService.getCustomerByContactNumber(contactNumber);
  }

  /**
   * Fetches a customer by their username.
   *
   * @param {string} username - The username of the customer, which can be either an email or a contact number.
   * @returns {Promise<CustomerEntity>} - The customer entity associated with the provided username.
   */
  async getCustomerByUsername(username: string): Promise<CustomerEntity> {
    return await this.customerService.getCustomerByEmailOrContactNumber(
      username,
    );
  }
  async createCustomerWithoutOtp(CustomerSignupWithoutOtpDto: CustomerSignupWithoutOtpDto): Promise<CustomerEntity> {
    const isCustomerExistWithProvidedEmail = await this.getCustomerByEmail(CustomerSignupWithoutOtpDto.email);
    const isCustomerExistWithContactNumber = await this.getCustomerByContactNumber(CustomerSignupWithoutOtpDto.contactNumber);

    if (isCustomerExistWithContactNumber || isCustomerExistWithProvidedEmail) {
      throw new BadRequestException(`User already exists with provided details`);
    }

    const encryptedPassword = await this.bcryptEncryptionService.encrypt(CustomerSignupWithoutOtpDto.password);
    CustomerSignupWithoutOtpDto.password = encryptedPassword;

    return this.customerRepository.getRepository().save(CustomerSignupWithoutOtpDto);
  }
  /**
   * Saves a new customer to the database.
   *
   * @param {CustomerDto} customerDto - The data transfer object containing customer details.
   *
   * - The method encrypts the customer's password using a secure hashing algorithm.
   * - Calls the `createCustomer` method of the customer service to store the customer data in the database.
   *
   * @returns {Promise<CustomerEntity>} - A promise that resolves to the created customer entity.
   *
   * @throws {HttpException} - Throws an exception if there is an error during saving.
   */
  async save(customerSignUpDto: CustomerSignupDto): Promise<CustomerEntity> {
    return this.customerService.createCustomer(customerSignUpDto);
  }

  async getCustomerByEmailOrContactNumber(
    username: string,
  ): Promise<CustomerEntity> {
    return this.customerService.getCustomerByEmailOrContactNumber(username);
  }

  async updatePassword(username: string, password: string): Promise<void> {
    await this.customerService.updatePassword(username, password);
  }

  async getCustomerByIdOrThrow(customerId: number): Promise<CustomerEntity> {
    const customer =
      await this.customerService.getCustomerByIdOrThrow(customerId);
    return customer;
  }
}
