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
        name: 'Hair Styling',
        description: 'Professional hair styling services, including cuts, colors, and treatments.',
      },
      {
        _id: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3ce'),
        name: 'Facial Treatments',
        description: 'Rejuvenating facial treatments tailored for all skin types.',
      },
      {
        _id: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3cf'),
        name: 'Manicure & Pedicure',
        description: 'Comprehensive hand and foot care, including nail art and grooming.',
      },
      {
        _id: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3d0'),
        name: 'Makeup & Bridal Services',
        description: 'Professional makeup services for everyday wear or special occasions.',
      },
      {
        _id: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3d1'),
        name: 'Massage Therapy',
        description: 'Relaxing and therapeutic massages to ease stress and muscle tension.',
      },
      {
        _id: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3d2'),
        name: 'Waxing & Threading',
        description: 'Hair removal services, including waxing and threading for a smooth finish.',
      },
      {
        _id: new mongoose.Types.ObjectId('64b350d3b95e7bc7f13bb3d3'),
        name: 'Hair Spa',
        description: 'Intensive hair care treatments for nourishment and repair.',
      },
    ];

    await this.categoryRepository.getRepository().deleteMany({});
    const categoryDocuments = categories.map((category) =>
      this.categoryRepository.getRepository().create(category),
    );
    const resolvedDocuments = await Promise.all(categoryDocuments);
    await this.categoryRepository.getRepository().bulkSave(resolvedDocuments);
  }
}
