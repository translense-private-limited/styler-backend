import { forwardRef, Module } from '@nestjs/common';
import { SeedController } from './controllers/seed.controller';
import { SeedService } from './services/seed.service';
import { ClientModule } from '@modules/client/client/client.module';  // Import ClientModule
import { OutletModule } from '@modules/client/outlet/outlet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from '@modules/client/client/entities/client.entity';  // Import ClientEntity
import { OutletEntity } from '@modules/client/outlet/entities/outlet.entity';
import { RoleEntity } from '@modules/authorization/entities/role.entity';
import { getMysqlDataSource } from '@modules/database/data-source';
import { AuthorizationModule } from '@modules/authorization/authorization.module';
import { DatabaseModule } from '@modules/database/database.module';
import { SeedCategoryData } from './data/category.data';
import { SeedOutletData } from './data/outlets.data';
import { SeedRoleData } from './data/roles.data';
import { SeedClientData } from './data/client.data';
import { SeedAdminData } from './data/admin.data';
import { AdminModule } from '../admin/admin.module';
import { CategoryModule } from '@modules/admin/category/category.module';
import { CustomerModule } from '@modules/customer/customer.module';
import { SeedCustomerData } from './data/customer.data';
import { UtilsModule } from '@src/utils/utils.module';
import { SeedAddressData } from './data/address.data';
import { ServiceModule } from '@modules/client/services/service.module';
import { SeedServiceData } from './data/service.data';
import { SeedClientOutletMappingData } from './data/client-outlet-mapping.data';
import { ClientOutletMappingModule } from '@modules/admin/client-outlet-mapping/client-outlet-mapping.module';
import { SeedEventConfigurationData } from './data/event-configuration.data';
import { NotificationModule } from '@src/utils/notification/notification.module';

@Module({
  imports: [
    ClientModule,
    forwardRef(()=>OutletModule), 
    AuthorizationModule,  
    TypeOrmModule.forFeature([ClientEntity, OutletEntity, RoleEntity], getMysqlDataSource()),
    DatabaseModule,
    forwardRef(() => AdminModule), // Use forwardRef to avoid circular dependency
    CategoryModule,
    CustomerModule,
    UtilsModule,
    ServiceModule,
    ClientOutletMappingModule,
    NotificationModule,
  ],
  controllers: [SeedController],
  providers: [SeedService,SeedClientData,SeedOutletData,SeedRoleData,SeedCategoryData,SeedAdminData,SeedCustomerData,SeedAddressData,SeedServiceData,SeedClientOutletMappingData,SeedEventConfigurationData],
})
export class SeedModule {}
