// category.external.ts
import { Injectable } from '@nestjs/common';
import { CategoryService } from './category.service';

@Injectable()
export class CategoryExternal {
  constructor(private readonly categoryService: CategoryService) {}

  async getCategoryById(categoryId: string) {
    return this.categoryService.findByIdOrThrow(categoryId);
  }
}
