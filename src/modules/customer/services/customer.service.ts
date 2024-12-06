import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CustomerEntity } from '../entities/customer.entity';
import { CustomerRepository } from '../repositories/customer.repository';
import { CustomerDto } from '../dtos/customer.dto';
import { BcryptEncryptionService } from '@modules/encryption/services/bcrypt-encryption.service';
import { isContactNumber, isEmail } from '@src/utils/validators/email-contact.validator';
import { throwIfNotFound } from '@src/utils/exceptions/common.exception';

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
    // Use the helper function to handle the NotFoundException
    throwIfNotFound(customer, `No user exists with the provided id`);
    return customer;
  }

  async getCustomerById(customerId: number): Promise<CustomerEntity> {
    return this.getCustomerByIdOrThrow(customerId);
  }

  async getCustomerByEmailIdOrThrow(email: string): Promise<CustomerEntity> {
    const customer = await this.customerRepository
      .getRepository()
      .findOne({ where: { email } });
    // Use the helper function to handle the NotFoundException
    throwIfNotFound(customer, `No user exists with the provided email`);
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

  async getCustomerByEmailOrContactNumber(username: string): Promise<CustomerEntity | null> {
    const repository = this.customerRepository.getRepository();

    if (isEmail(username)) {
        return repository.findOne({ where: { email: username } });
    }

    if (isContactNumber(username)) {
        return repository.findOne({ where: { contactNumber: +username } });
    }

    throw new Error('Invalid username format');
  }

  async updatePassword(username: string, password: string) {
    const customer = await this.getCustomerByEmailOrContactNumber(username);

    // Use the helper function to handle the NotFoundException
    throwIfNotFound(customer, `No user exists with the provided ${username}`);

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
