import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseSchema } from '@src/utils/repositories/base-schema';
import { getMongodbDataSource } from '@modules/database/data-source';
import { ServiceSchema } from '../schema/service.schema';
import { CategoryRepository } from '@modules/admin/category/repository/category.repository';
import { CategoryWithServiceCountDto } from '../dtos/category-with-service-count.dto';

@Injectable()
export class ServiceRepository extends BaseSchema<ServiceSchema> {
  private readonly serviceRepository: Model<ServiceSchema>;

  constructor(
    @InjectModel(ServiceSchema.name, getMongodbDataSource())
    serviceModel: Model<ServiceSchema>,
    private readonly categoryRepository: CategoryRepository,
  ) {
    super(serviceModel); // Pass the model to the base class
    this.serviceRepository = serviceModel;
  }

  /**
   * Retrieves categories with their details and the count of services associated with a specific outlet.
   *
   * @param outletId - The unique identifier of the outlet to filter services.
   * @returns An array of categories, each including its details and the count of services.
   */
  async getCategoriesWithServiceCountByOutlet(
    outletId: number,
  ): Promise<CategoryWithServiceCountDto[]> {
    return await this.categoryRepository.getRepository().aggregate([
      {
        $lookup: {
          from: this.serviceRepository.collection.name, // Dynamically resolve the collection name for services
          let: { categoryId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        '$categoryId',
                        { $toObjectId: '$$categoryId' }, // Ensure comparison with ObjectId
                      ],
                    },
                    { $eq: ['$outletId', outletId] }, // Match outletId with the provided outlet
                  ],
                },
              },
            },
          ],
          as: 'services', // Name the joined array as 'services'
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          serviceCount: { $size: '$services' }, // Add a field for the count of services
        },
      },
    ]);
  }
}
