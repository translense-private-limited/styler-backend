import { Module } from '@nestjs/common';
import { ClientService } from './services/client.service';
import { ClientRepository } from './repository/client.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './entities/client.entity';
import { getMysqlDataSource } from '@modules/database/data-source';
import { ClientExternalService } from './services/client-external.service';
import { EncryptionModule } from '@modules/encryption/encryption.module';
import { AuthorizationModule } from '@modules/authorization/authorization.module';
import { TeamController } from './controllers/team.controller';
import { TeamMemberService } from './services/team-member.service';
import { ClientAdminController } from './controllers/client-admin.controller';
import { ClientAdminService } from './services/client-admin.service';
// import { AdminModule } from '@modules/admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity], getMysqlDataSource()),
    EncryptionModule,
    AuthorizationModule,
  ],
  providers: [
    ClientService,
    ClientRepository,
    ClientExternalService,
    TeamMemberService,
    ClientAdminService,
  ],
  controllers: [TeamController,ClientAdminController],
  exports: [ClientExternalService,ClientRepository],
})
export class ClientModule {}
