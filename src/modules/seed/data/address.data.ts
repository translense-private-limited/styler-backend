import { Injectable } from '@nestjs/common';
import { AddressRepository } from '@src/utils/repositories/address.repository';

@Injectable()
export class SeedAddressData {
  constructor(private readonly addressRepository: AddressRepository) {}

  async seedAddresses(): Promise<void> {
    const queryRunner = this.addressRepository.getRepository().manager.connection.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
      await queryRunner.query('TRUNCATE TABLE address;');
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');

      const addresses = [
        {
          addressId: 1,
          propertyNumber:'12-A',
          country: 'India',
          state: 'Maharashtra',
          district: 'Mumbai Suburban',
          city: 'Mumbai',
          pincode: 400001,
          street: 'Marine Drive',
          landmark: 'Near Gateway of India',
          outletId: 1,
        },
        {
          addressId: 2,
          propertyNumber:'13-A',
          country: 'India',
          state: 'Karnataka',
          district: 'Bangalore Urban',
          city: 'Bangalore',
          pincode: 560001,
          street: 'MG Road',
          landmark: 'Near Cubbon Park',
          outletId: 2,
        },
      ];

      await this.addressRepository.getRepository().save(addresses);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
