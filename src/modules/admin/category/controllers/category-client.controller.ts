import { Controller, Get } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CategorySchema } from '../entities/category.schema';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '@src/utils/decorators/public.decorator';

@Controller('client')
@ApiTags('Client/category')
@ApiBearerAuth('jwt')
export class CategoryClientController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('categories')
  @Public()
  async findAll(): Promise<CategorySchema[]> {
    return this.categoryService.findAll();
  }
}
