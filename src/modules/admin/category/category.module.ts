import { Module } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryRepository } from './repository/category.repository';
import { CategoryController } from './controllers/category.controller';

import { CategoryModel, CategorySchema } from './entities/category.schema';
import { getMongodbDataSource } from '@modules/database/data-source';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: CategorySchema.name, schema: CategoryModel }],
      getMongodbDataSource(),
    ),
  ],
  providers: [CategoryService, CategoryRepository],
  controllers: [CategoryController],
})
export class CategoryModule {}
