// category.external.ts
import { Injectable } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Types } from 'mongoose';
import { CategorySchema } from '../entities/category.schema';

@Injectable()
export class CategoryExternal {
  constructor(private readonly categoryService: CategoryService) {}

  async getCategoryById(categoryId: Types.ObjectId): Promise<CategorySchema> {
    return this.categoryService.findByIdOrThrow(categoryId);
  }
}
