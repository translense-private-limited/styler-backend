import { Body, Controller, Delete, Get, Param, Post, HttpCode, HttpStatus, Patch } from "@nestjs/common";
import { CategoryService } from "../services/category.service";
import { CategorySchema } from "../entities/category.schema";
import { CategoryDto } from "../dtos/category.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('category')
@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Fetch all categories
  @Get('categories')
  async findAll(): Promise<CategorySchema[]> {
    return this.categoryService.findAll();
  }

  // Create a new category
  @Post('category')
  async create(@Body() createCategoryDto: CategoryDto): Promise<CategorySchema> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  // Get a specific category by its ID
  @Get('category/:id')
  async getById(@Param('id') categoryId: string): Promise<CategorySchema> {
    return this.categoryService.findByIdOrThrow(categoryId);
  }

  // Delete a specific category by its ID and return 204 status
  @Delete('category/:id')
  @HttpCode(HttpStatus.NO_CONTENT) // Return status 204 No Content on successful delete
  async deleteCategory(@Param('id') categoryId: string): Promise<void> {
    await this.categoryService.delete(categoryId);
  }

  // Delete all categories and return 204 status
  @Delete('categories')
  @HttpCode(HttpStatus.NO_CONTENT) // Return status 204 No Content on successful delete
  async deleteAll(): Promise<void> {
    await this.categoryService.deleteAll();
  }

  @Patch('category/:id')
  async updateCategory(
    @Param('id') categoryId: string,
    @Body() updateCategoryDto: Partial<CategoryDto>
  ): Promise<CategorySchema> {
    return this.categoryService.updateCategory(categoryId, updateCategoryDto);
  }
}
