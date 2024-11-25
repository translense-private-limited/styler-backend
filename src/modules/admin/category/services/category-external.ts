// category.external.ts
import { Injectable } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Types } from 'mongoose';

@Injectable()
export class CategoryExternal {
  constructor(private readonly categoryService: CategoryService) {}

  async getCategoryById(categoryId: Types.ObjectId) {
    return this.categoryService.findByIdOrThrow(categoryId);
  }
}
