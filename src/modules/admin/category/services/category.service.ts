import {
  Body,
  Injectable,
  Logger,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { CategoryRepository } from '../repository/category.repository';
import { CategoryDto } from '../dtos/category.dto';
import { CategorySchema } from '../entities/category.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Mongoose, Types } from 'mongoose';
import { getMongodbDataSource } from '@modules/database/data-source';

@Injectable()
export class CategoryService {
  private logger = new Logger(CategoryService.name);

  // constructor(
  //   @InjectModel(CategorySchema.name, getMongodbDataSource()) // Remove getMongodbDataSource() if not necessary
  //   private categoryRepository: Model<CategorySchema>
  // ) {}

  constructor(private categoryRepository: CategoryRepository) {}

  async findAll(): Promise<CategorySchema[]> {
    return this.categoryRepository.getRepository().find();
  }

  async createCategory(
    createCategoryDto: CategoryDto,
  ): Promise<CategorySchema> {
    console.log(createCategoryDto, '****');
    try {
      // Create a new category document using create()
      const createdCategory = await this.categoryRepository
        .getRepository()
        .create(createCategoryDto);
      return createdCategory;
    } catch (error) {
      this.logger.error('Error in creating category ', error);
      throw error;
    }
  }

  async findByIdOrThrow(id: string): Promise<CategorySchema> {
    const category = await this.categoryRepository.getRepository().findById(id);
    if (!category) {
      this.logger.error('Invalid Category id');
      throw new NotFoundException('no category exist with provided id');
    }
    return category;
  }

  async delete(id: string): Promise<void> {
    const category = await this.findByIdOrThrow(id);
    try {
      await this.categoryRepository
        .getRepository()
        .deleteOne({ _id: new Types.ObjectId(id) });
    } catch (error) {
      this.logger.error('error in deleting the category', error);
      throw error;
    }
  }

  async deleteAll(): Promise<void> {
    await this.categoryRepository.getRepository().deleteMany({});
  }

  // Update specific fields of a category based on what the user provides
  async updateCategory(
    categoryId: string,
    updateCategoryDto: Partial<CategoryDto>,
  ): Promise<CategorySchema> {
    try {
      const updatedCategory = await this.categoryRepository
        .getRepository()
        .findByIdAndUpdate(
          categoryId,
          { $set: updateCategoryDto }, // Only updates the fields provided
          { new: true, omitUndefined: true }, // Return updated document, skip undefined fields
        );

      if (!updatedCategory) {
        throw new Error('Category not found');
      }

      return updatedCategory;
    } catch (error) {
      this.logger.error('Error in updating category', error);
      throw error;
    }
  }
}
