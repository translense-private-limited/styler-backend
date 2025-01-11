import { Module } from '@nestjs/common';
import { ClientService } from './services/client.service';
import { ClientRepository } from './repository/client.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './entities/client.entity';
import { getMysqlDataSource } from '@modules/database/data-source';
import { ClientExternalService } from './services/client-external.service';
import { EncryptionModule } from '@modules/encryption/encryption.module';
import { AuthorizationModule } from '@modules/authorization/authorization.module';
import { ExtendedClientController } from './controllers/extended-client.controller';
import { ExtendedClientService } from './services/extended-client.service';
import { ClientAdminController } from './controllers/client-admin.controller';
import { ClientAdminService } from './services/client-admin.service';
import { ClientDocsEntity } from './entities/client-docs.entity';
import { ClientDocsRepository } from './repository/client-docs.repository';
import { ClientDocsService } from './services/client-docs-service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity,ClientDocsEntity], getMysqlDataSource()),
    EncryptionModule,
    AuthorizationModule,
  ],
  providers: [
    ClientService,
    ClientRepository,
    ClientExternalService,
    ExtendedClientService,
    ClientAdminService,
    ClientDocsRepository,
    ClientDocsService,
  ],
  controllers: [ExtendedClientController,ClientAdminController],
  exports: [ClientExternalService,ClientRepository],
})
export class ClientModule {}
