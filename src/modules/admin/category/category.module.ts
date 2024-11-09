import { Module } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryRepository } from './repository/category.repository';
import { CategoryController } from './controllers/category.controller';

import { CategoryModel, CategorySchema } from './entities/category.schema';
import { getMongodbDataSource } from '@modules/database/data-source';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryExternal } from './services/category-external';
import { CategoryClientController } from './controllers/category-client.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: CategorySchema.name, schema: CategoryModel }],
      getMongodbDataSource(),
    ),
  ],
  providers: [CategoryService, CategoryRepository, CategoryExternal],
  controllers: [CategoryController, CategoryClientController],
  exports: [CategoryExternal],
})
export class CategoryModule {}
