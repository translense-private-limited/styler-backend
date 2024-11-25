import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ClientModule, 
    OutletModule, 
    AuthorizationModule,  
    TypeOrmModule.forFeature([ClientEntity, OutletEntity, RoleEntity], getMysqlDataSource()),  // Register entities
  ],
  controllers: [SeedController],
  providers: [SeedService],  // Provide SeedService
})
export class SeedModule {}
