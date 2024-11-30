import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [CategoryModule,SeedModule],
})
export class AdminModule {}
