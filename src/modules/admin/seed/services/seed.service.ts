import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoClient, ObjectId } from 'mongodb';
import { GenderEnum } from '@src/utils/enums/gender.enums';
import { UserTypeEnum } from '@modules/authorization/enums/usertype.enum'; // Import the enum
import { OutletStatusEnum } from '@modules/client/outlet/enums/outlet-status.enum';
import { ClientRepository } from '@modules/client/client/repository/client.repository';
import { OutletRepository } from '@modules/client/outlet/repositories/outlet.repository';
import { RoleRepository } from '@modules/authorization/repositories/role.repository';


@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(ClientRepository)
    private readonly clientRepository: ClientRepository, // Inject ClientRepository directly
    @InjectRepository(OutletRepository)
    private readonly outletRepository: OutletRepository,
    @InjectRepository(RoleRepository)
    private readonly roleRepository: RoleRepository,
  ) {}
  async seedMySQL(): Promise<void> {
    // Insert data into MySQL tables
    await this.clientRepository.getRepository().save({
        name: 'Sample Outlet Client',
        email: 'client@translense.com',
        password: '$2b$10$We.1TuspN0s/OCg5UgkIte6s8aPreGZGpqXOcrDOze2hgKfLko8kC',
        contactNumber: '1234567890',
        roleId: 21,
        gender: GenderEnum.MALE,
        pastExperience: 5,
        about: 'Experienced professional',
        outletId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const outlets = [
        {
          id: 1,
          name: 'Sample Outlet',
          description: 'This is a sample outlet description.',
          status: OutletStatusEnum.UNDER_CONSTRUCTION, // Use the enum value here
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
          status: OutletStatusEnum.COMING_SOON, // Use the enum value here
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

  }

    async seedMongoDB(): Promise<void> {
    // MongoDB seeding logic
    const mongoUri = 'mongodb://root:root@localhost:27017/?authSource=admin';
    const mongoClient = new MongoClient(mongoUri);

    // Define categories to be seeded
    const categories = [
        { _id: new ObjectId("64b350d3b95e7bc7f13bb3cd"), name: "Hair Care", description: "Hair Care products" },
        { _id: new ObjectId("64b350d3b95e7bc7f13bb3ce"), name: "Skin Care", description: "Skin Care products" },
        { _id: new ObjectId("64b350d3b95e7bc7f13bb3cf"), name: "Nail Care", description: "Nail Care products" },
        { _id: new ObjectId("64b350d3b95e7bc7f13bb3d0"), name: "Makeup", description: "Makeup products" },
        { _id: new ObjectId("64b350d3b95e7bc7f13bb3d1"), name: "Fragrance", description: "Fragrance products" }
    ];

    try {
        // Connect to MongoDB
        await mongoClient.connect();
        const database = mongoClient.db('styler');
        const categoriesCollection = database.collection('categories');

        // Bulk write operation to insert or update categories
        const bulkWriteOperations = categories.map(category => ({
        updateOne: {
            filter: { _id: category._id }, // Match by _id
            update: { $set: category },     // Update the category fields
            upsert: true                    // Insert if the category doesn't exist
        }
        }));

        // Execute the bulk write operation
        const result = await categoriesCollection.bulkWrite(bulkWriteOperations);

        // Log the result of the operation
        console.log(`MongoDB seeding completed: ${JSON.stringify(result)}`);
    } catch (error) {
        console.error('Error during MongoDB seeding:', error);
    } finally {
        // Ensure the client is closed after the operation
        await mongoClient.close();
    }
    }
}

