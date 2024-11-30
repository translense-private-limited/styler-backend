import { Module } from '@nestjs/common';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './services/customer.service';
import { CustomerExternalService } from './services/customer-external.service';
import { CustomerRepository } from './repositories/customer.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { getMysqlDataSource } from '@modules/database/data-source';

import { EncryptionModule } from '@modules/encryption/encryption.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity], getMysqlDataSource()),
    EncryptionModule,
    OrderModule
  ],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerExternalService, CustomerRepository],
  exports: [CustomerExternalService],
})
export class CustomerModule {}
