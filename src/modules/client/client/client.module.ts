import { Module } from '@nestjs/common';
import { ClientService } from './services/client.service';
import { ClientRepository } from './repository/client.repository';
import { ClientController } from './controllers/client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './entities/client.entity';
import { getMysqlDataSource } from '@modules/database/data-source';
import { ClientExternalService } from './services/client-external.service';
import { EncryptionModule } from '@modules/encryption/encryption.module';
import { AuthorizationModule } from '@modules/authorization/authorization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity], getMysqlDataSource()),
    EncryptionModule,
    AuthorizationModule
  ],
  providers: [ClientService, ClientRepository, ClientExternalService],
  controllers: [ClientController],
  exports: [ClientExternalService],
})
export class ClientModule {}
