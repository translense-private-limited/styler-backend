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
import { OutletAdminController } from './controllers/outlet-admin.controller';
import { OutletAdminService } from './services/outlet-admin.service';
import { ClientModule as ClientUserModule } from '../client/client.module';
// import { AdminModule } from '@modules/admin/admin.module';
import { ClientOutletMappingModule } from '@modules/admin/client-outlet-mapping/client-outlet-mapping.module';
import { AuthorizationModule } from '@modules/authorization/authorization.module';
import { UtilsModule } from '@src/utils/utils.module';

@Module({
  imports: [TypeOrmModule.forFeature([OutletEntity], getMysqlDataSource()),
  ServiceModule,
  ClientUserModule,
  ClientOutletMappingModule,
  AuthorizationModule,
  UtilsModule,
],
  providers: [
    OutletService,
    OutletRepository,
    OutletExternalService,
    OutletCustomerService,
    OutletAdminService,
  ],
  controllers: [OutletController, OutletCustomerController,OutletAdminController],
  exports: [OutletExternalService,OutletRepository],

})
export class OutletModule {}
