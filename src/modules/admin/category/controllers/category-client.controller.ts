import { Controller, Get } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CategorySchema } from '../entities/category.schema';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('client')
@ApiTags('category/client')
@ApiBearerAuth('jwt')
export class CategoryClientController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('categories')
  async findAll(): Promise<CategorySchema[]> {
    return this.categoryService.findAll();
  }
}
