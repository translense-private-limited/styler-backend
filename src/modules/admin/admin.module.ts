import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { SeedModule } from './seed/seed.module';
import { AdminService } from './services/admin.service';
import { AdminExternalService } from './services/admin-external.service';
import { AdminRepository } from './Repositories/admin.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { getMysqlDataSource } from '@modules/database/data-source';
import { EncryptionModule } from '@modules/encryption/encryption.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity],getMysqlDataSource()), // Register AdminEntity here
    CategoryModule,
    SeedModule,
    EncryptionModule
  ],
  controllers:[],
  providers:[AdminService,AdminExternalService,AdminRepository],
  exports:[AdminExternalService]
})
export class AdminModule {}
