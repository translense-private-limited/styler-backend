import { getMongodbDataSource } from '@modules/database/data-source';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceModel, ServiceSchema } from './schema/service.schema';
import { ServiceController } from './controllers/service.controller';
import { ServiceService } from './services/service.service';
import { ServiceRepository } from './repositories/service.repository';
import { CategoryModule } from '@modules/admin/category/category.module';
import { ServiceCustomerController } from './controllers/service-customer.controller';
import { ServiceCustomerService } from './services/service-customer.service';
import { ServiceExternal } from './services/service-external';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: ServiceSchema.name, schema: ServiceModel }],
      getMongodbDataSource(),
    ),
    CategoryModule,
  ],
  exports: [ServiceExternal],
  providers: [ServiceService, ServiceRepository, ServiceCustomerService,ServiceExternal],
  controllers: [ServiceController, ServiceCustomerController],
})
export class ServiceModule {}
