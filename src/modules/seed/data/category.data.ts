import { Injectable } from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';

@Injectable()
export class SeedCategoryData {
  // Update the connection string to use host.docker.internal:4002
  private readonly mongoUri = 'mongodb://root:root@172.17.0.1:4002/styler?authSource=admin';

  async seedCategories(): Promise<void> {
    const mongoClient = new MongoClient(this.mongoUri);

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
      console.log(`Categories seeding completed: ${JSON.stringify(result)}`);
    } catch (error) {
      console.error('Error during categories seeding:', error);
      throw error;
    } finally {
      await mongoClient.close();
    }
  }
}
