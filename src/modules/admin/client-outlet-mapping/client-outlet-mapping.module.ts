import { forwardRef, Module } from '@nestjs/common';
import { ClientOutletMappingService } from './services/client-outlet-mapping.service';
import { ClientOutletMappingRepository } from './repositories/client-outlet-mapping.repository';
import { ClientOutletMappingController } from './controllers/client-outlet-mapping.controller';
import { OutletModule } from '@modules/client/outlet/outlet.module';
import { ClientModule } from '@modules/client/client/client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getMysqlDataSource } from '@modules/database/data-source';
import { ClientOutletMappingEntity } from './entities/client-outlet-mapping.entity';
import { ClientOutletMappingExternalService } from './services/client-outlet-mapping-external.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientOutletMappingEntity], getMysqlDataSource()),
    forwardRef(() => OutletModule),
    forwardRef(() => ClientModule),
  ],
  providers: [ClientOutletMappingService, ClientOutletMappingRepository,ClientOutletMappingExternalService],
  controllers: [ClientOutletMappingController],
  exports:[ClientOutletMappingExternalService,ClientOutletMappingRepository]
})
export class ClientOutletMappingModule {}
