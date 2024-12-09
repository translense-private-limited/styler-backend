import { CategoryRepository } from '@modules/admin/category/repository/category.repository';
import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class SeedCategoryData {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async seedCategories(): Promise<void> {
    const categories = [
      {
        _id: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3cd'),
        name: 'Hair Care',
        description: 'Hair Care products',
      },
      {
        _id: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3ce'),
        name: 'Skin Care',
        description: 'Skin Care products',
      },
      {
        _id: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3cf'),
        name: 'Nail Care',
        description: 'Nail Care products',
      },
      {
        _id: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3d0'),
        name: 'Makeup',
        description: 'Makeup products',
      },
      {
        _id: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3d1'),
        name: 'Fragrance',
        description: 'Fragrance products',
      },
    ];

    try {
      // Convert plain objects into Mongoose documents synchronously
      const categoryDocuments = categories.map((category) =>
        this.categoryRepository.getRepository().create(category),
      );

      // Resolve all promises to get Mongoose documents
      const resolvedDocuments = await Promise.all(categoryDocuments);

      // Save all documents in bulk
      await this.categoryRepository.getRepository().bulkSave(resolvedDocuments);

      console.log('Categories seeding completed successfully.');
    } catch (error) {
      console.error('Error during categories seeding:', error);
      throw error;
    }
  }
}
