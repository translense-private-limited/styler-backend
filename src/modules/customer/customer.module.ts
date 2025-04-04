import { Module } from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import { CustomerExternalService } from './services/customer-external.service';
import { CustomerRepository } from './repositories/customer.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { getMysqlDataSource } from '@modules/database/data-source';

import { EncryptionModule } from '@modules/encryption/encryption.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity], getMysqlDataSource()),
    EncryptionModule,
    ReviewModule
  ],
  controllers: [],
  providers: [CustomerService, CustomerExternalService, CustomerRepository],
  exports: [CustomerExternalService, CustomerRepository],
})
export class CustomerModule {}
