import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomerEntity } from '../entities/customer.entity';
import { CustomerRepository } from '../repositories/customer.repository';
import { CustomerDto } from '../dtos/customer.dto';
import { BcryptEncryptionService } from '@modules/encryption/services/bcrypt-encryption.service';

@Injectable()
export class CustomerService {
  constructor(
    private customerRepository: CustomerRepository,
    private bcryptEncryptionService: BcryptEncryptionService,
  ) {}
  private async getCustomerByIdOrThrow(
    customerId: number,
  ): Promise<CustomerEntity> {
    const customer = await this.customerRepository.getRepository().findOne({
      where: {
        id: customerId,
      },
    });
    if (!customer) {
      throw new NotFoundException('No User exists with provided id');
    }
    return customer;
  }

  async getCustomerById(customerId: number): Promise<CustomerEntity> {
    return this.getCustomerByIdOrThrow(customerId);
  }

  async getCustomerByEmailIdOrThrow(email: string): Promise<CustomerEntity> {
    const customer = await this.customerRepository
      .getRepository()
      .findOne({ where: { email } });
    if (!customer) {
      throw new NotFoundException('No user exists with provide email');
    }
    return customer;
  }

  async getCustomerByEmailId(email: string): Promise<CustomerEntity> {
    const customer = await this.customerRepository
      .getRepository()
      .findOne({ where: { email } });

    return customer;
  }

  async getCustomerByContactNumber(
    contactNumber: number,
  ): Promise<CustomerEntity> {
    const customer = await this.customerRepository
      .getRepository()
      .findOne({ where: { contactNumber } });

    return customer;
  }

  async createCustomer(customerDto: CustomerDto): Promise<CustomerEntity> {
    const isCustomerExistWithProvidedEmail = await this.getCustomerByEmailId(
      customerDto.email,
    );
    const isCustomerExistWithContactNumber =
      await this.getCustomerByContactNumber(customerDto.contactNumber);

    if (isCustomerExistWithContactNumber || isCustomerExistWithProvidedEmail) {
      throw new BadRequestException(`User already exits with provided details`);
    }

    const encryptedPassword = await this.bcryptEncryptionService.encrypt(
      customerDto.password,
    );

    customerDto.password = encryptedPassword;

    return this.customerRepository.getRepository().save(customerDto);
  }

  // Helper function to check if the string is an email
  private isEmail(username: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(username);
  }

  // Helper function to check if the string is a valid contact number
  private isContactNumber(username: string): boolean {
    const contactNumberPattern = /^\d{10}$/;
    return contactNumberPattern.test(username);
  }

  async getCustomerByEmailOrContactNumber(
    username: string,
  ): Promise<CustomerEntity | null> {
    // If it's an email, query by email, if it's a contact number, query by contactNumber
    if (this.isEmail(username)) {
      return this.customerRepository.getRepository().findOne({
        where: { email: username },
      });
    } else if (this.isContactNumber(username)) {
      return this.customerRepository.getRepository().findOne({
        where: { contactNumber: +username },
      });
    } else {
      // If it's neither a valid email nor a contact number
      throw new Error('Invalid username format');
    }
  }

  async updatePassword(username: string, password: string) {
    const customer = await this.getCustomerByEmailOrContactNumber(username);

    // Throw an error if the customer does not exist
    if (!customer) {
      throw new NotFoundException(
        `No registered customer found with the provided username: ${username}`,
      );
    }

    const encryptedPassword =
      await this.bcryptEncryptionService.encrypt(password);
    customer.password = encryptedPassword;
    await this.customerRepository.getRepository().save(customer);
  }

  // /**
  //  * Fetches a customer by their username.
  //  *
  //  * @param {string} username - The username of the customer, which can be either an email or a contact number.
  //  * @returns {Promise<CustomerEntity>} - The customer entity associated with the provided username.
  //  */
  // async getCustomerByUsername(username: string): Promise<CustomerEntity> {
  //   return await this.customerRepository.getRepository().findOne({
  //     where: [
  //       {
  //         email: username,
  //         contactNumber: +username,
  //       },
  //     ],
  //   });
  // }
}