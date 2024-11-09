import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseSchema } from '@src/utils/repositories/base-schema';
import { getMongodbDataSource } from '@modules/database/data-source';
import { CategorySchema } from '../entities/category.schema';

@Injectable()
export class CategoryRepository extends BaseSchema<CategorySchema> {
  private readonly categoryRepository: Model<CategorySchema>;

  constructor(
    @InjectModel(CategorySchema.name, getMongodbDataSource())
    CategoryModel: Model<CategorySchema>, // Change parameter name to CategoryModel
  ) {
    super(CategoryModel); // Pass the model to the base class
    this.categoryRepository = CategoryModel; // Assign to the instance variable
  }
}
