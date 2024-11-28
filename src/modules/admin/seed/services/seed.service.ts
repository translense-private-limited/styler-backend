import { Injectable } from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';
import { GenderEnum } from '@src/utils/enums/gender.enums';
import { UserTypeEnum } from '@modules/authorization/enums/usertype.enum';
import { OutletStatusEnum } from '@modules/client/outlet/enums/outlet-status.enum';
import { ClientRepository } from '@modules/client/client/repository/client.repository';
import { OutletRepository } from '@modules/client/outlet/repositories/outlet.repository';
import { RoleRepository } from '@modules/authorization/repositories/role.repository';

@Injectable()
export class SeedService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly outletRepository: OutletRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async seedMySQL(): Promise<void> {
    const queryRunner = this.clientRepository
      .getRepository()
      .manager.connection.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      // Truncate tables
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
      await queryRunner.query('TRUNCATE TABLE outlets;');
      await queryRunner.query('TRUNCATE TABLE roles;');
      await queryRunner.query('TRUNCATE TABLE client;');
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');

      // Insert data into the clients table
      await this.clientRepository.getRepository().save({
        name: 'Sample Outlet Client',
        email: 'client@translense.com',
        password:
          '$2b$10$We.1TuspN0s/OCg5UgkIte6s8aPreGZGpqXOcrDOze2hgKfLko8kC',
        contactNumber: '1234567890',
        roleId: 21,
        gender: GenderEnum.MALE,
        pastExperience: 5,
        about: 'Experienced professional',
        outletId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Insert data into the outlets table
      const outlets = [
        {
          id: 1,
          name: 'Sample Outlet',
          description: 'This is a sample outlet description.',
          status: OutletStatusEnum.UNDER_CONSTRUCTION,
          address: '123 Main Street, City, Country',
          latitude: 37.7749,
          longitude: -122.4194,
          phoneNumber: '+1234567890',
          email: 'sample@translense.com',
          website: 'http://www.sampleoutlet.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          clientId: 1,
        },
        {
          id: 2,
          name: 'Example Outlet',
          description: 'This is an example outlet description.',
          status: OutletStatusEnum.COMING_SOON,
          address: '456 Another Street, City, Country',
          latitude: 34.0522,
          longitude: -118.2437,
          phoneNumber: '+1987654321',
          email: 'example@translense.com',
          website: 'http://www.exampleoutlet.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          clientId: 2,
        },
      ];
      await this.outletRepository.getRepository().save(outlets);

      // Insert data into the roles table
      const roles = [
        {
          id: 21,
          name: 'owner',
          isSystemDefined: true,
          scope: UserTypeEnum.CLIENT,
          outletId: null,
        },
        {
          id: 22,
          name: 'manager',
          isSystemDefined: true,
          scope: UserTypeEnum.CLIENT,
          outletId: null,
        },
      ];
      await this.roleRepository.getRepository().save(roles);

      await queryRunner.commitTransaction();
      console.log('MySQL seeding completed successfully.');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error during MySQL seeding:', error);
    } finally {
      await queryRunner.release();
    }
  }

  async seedMongoDB(): Promise<void> {
    const mongoUri = 'mongodb://root:root@localhost:27017/?authSource=admin';
    const mongoClient = new MongoClient(mongoUri);

    const categories = [
      {
        _id: new ObjectId('64b350d3b95e7bc7f13bb3cd'),
        name: 'Hair Care',
        description: 'Hair Care products',
      },
      {
        _id: new ObjectId('64b350d3b95e7bc7f13bb3ce'),
        name: 'Skin Care',
        description: 'Skin Care products',
      },
      {
        _id: new ObjectId('64b350d3b95e7bc7f13bb3cf'),
        name: 'Nail Care',
        description: 'Nail Care products',
      },
      {
        _id: new ObjectId('64b350d3b95e7bc7f13bb3d0'),
        name: 'Makeup',
        description: 'Makeup products',
      },
      {
        _id: new ObjectId('64b350d3b95e7bc7f13bb3d1'),
        name: 'Fragrance',
        description: 'Fragrance products',
      },
    ];

    try {
      await mongoClient.connect();
      const database = mongoClient.db('styler');
      const categoriesCollection = database.collection('categories');

      const bulkWriteOperations = categories.map((category) => ({
        updateOne: {
          filter: { _id: category._id },
          update: { $set: category },
          upsert: true,
        },
      }));

      const result = await categoriesCollection.bulkWrite(bulkWriteOperations);
      console.log(`MongoDB seeding completed: ${JSON.stringify(result)}`);
    } catch (error) {
      console.error('Error during MongoDB seeding:', error);
    } finally {
      await mongoClient.close();
    }
  }
}
