import { Module } from '@nestjs/common';
import { ResourceController } from './controllers/resource.controller';
import { ResourceService } from './services/resource.service';
import { ResourceRepository } from './repositories/resource.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceEntity } from './entities/resource.entity';
import { RoleEntity } from './entities/role.entity';
import { getMysqlDataSource } from '@modules/database/data-source';
import { roleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { RoleRepository } from './repositories/role.repository';
import { RoleClientController } from './controllers/role-client.controller';
import { RoleClientService } from './services/role-client.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ResourceEntity, RoleEntity],
      getMysqlDataSource(),
    ),
  ],
  controllers: [ResourceController, roleController,RoleClientController],
  providers: [ResourceService, ResourceRepository, RoleService, RoleRepository,RoleClientService],
})
export class AuthorizationModule {}
