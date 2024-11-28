import { Module } from '@nestjs/common';
import { OutletService } from './services/outlet.service';
import { OutletRepository } from './repositories/outlet.repository';
import { OutletController } from './controllers/outlet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutletEntity } from './entities/outlet.entity';
import { getMysqlDataSource } from '@modules/database/data-source';
import { OutletExternalService } from './services/outlet-external.service';
import { OutletCustomerController } from './controllers/outlet-customer.controller';
import { OutletCustomerService } from './services/outlet-customer.service';
import { ServiceModule } from '../services/service.module';
import { CustomerOutletController } from './controllers/customer-outlet.controller';
import { CustomerOutletService } from './services/customer-outlet.service';

@Module({
  imports: [TypeOrmModule.forFeature([OutletEntity], getMysqlDataSource()),ServiceModule],
  providers: [
    OutletService,
    OutletRepository,
    OutletExternalService,
    OutletCustomerService,
    CustomerOutletService,
  ],
  controllers: [OutletController, OutletCustomerController,CustomerOutletController],
  exports: [OutletExternalService],
})
export class OutletModule {}
