import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from '../entities/client.entity';
import { getMysqlDataSource } from '@modules/database/data-source';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/utils/repositories/base-repository';
import { ExtendedClient } from '../dtos/extended-client.dto';
import { RoleEntity } from '@modules/authorization/entities/role.entity';
import { throwIfNotFound } from '@src/utils/exceptions/common.exception';
import { plainToInstance } from 'class-transformer';

export class ClientRepository extends BaseRepository<ClientEntity> {
  constructor(
    @InjectRepository(ClientEntity, getMysqlDataSource())
    protected repository: Repository<ClientEntity>,
  ) {
    super(repository);
  }

  async getClientDetails(clientId: number): Promise<ExtendedClient> {
      const clientWithRole = await this.repository
        .createQueryBuilder('client')
        .leftJoin('roles', 'role', 'role.id = client.roleId') // Join roles table based on the roleId
        .where('client.id = :clientId', { clientId })
        .select([
          'client.id AS clientId',
          'client.name AS clientName',
          'client.email AS clientEmail',
          'client.password AS clientPassword',
          'client.contactNumber AS clientContactNumber',
          'client.gender AS clientGender',
          'client.pastExperience AS clientPastExperience',
          'client.about AS clientAbout',
          'client.outletId AS clientOutletId',
          'role.id AS roleId',
          'role.name AS roleName',
          'role.isSystemDefined AS roleIsSystemDefined',
          'role.scope AS roleScope',
          'role.outletId AS roleOutletId',
        ])
        .getRawOne();
  
      throwIfNotFound(clientWithRole,`client not found`)
  
      const role = plainToInstance(RoleEntity, {
        id: clientWithRole.roleId,
        name: clientWithRole.roleName,
        isSystemDefined: clientWithRole.roleIsSystemDefined,
        scope: clientWithRole.roleScope,
        outletId: clientWithRole.roleOutletId,
      });
  
      const extendedClient = {
        createdAt:clientWithRole.createdAt,
        updatedAt:clientWithRole.updatedAt,
        id: clientWithRole.clientId,
        name: clientWithRole.clientName,
        email: clientWithRole.clientEmail,
        password: clientWithRole.clientPassword,
        contactNumber: clientWithRole.clientContactNumber,
        gender: clientWithRole.clientGender,
        pastExperience: clientWithRole.clientPastExperience,
        about: clientWithRole.clientAbout,
        outletId: clientWithRole.clientOutletId,
        role,
      };
      return extendedClient;
    }

    async getClientsByOutletId(outletId: number): Promise<ExtendedClient[]> {
      const clientsWithRoles = await this
        .getRepository()
        .createQueryBuilder('client')
        .leftJoinAndSelect('roles', 'role', 'client.roleId = role.id')
        .where('client.outletId = :outletId', { outletId })
        .select([
          'client.id AS id',
          'client.name AS name',
          'client.email AS email',
          'client.password AS password',
          'client.contactNumber AS contactNumber',
          'client.gender AS gender',
          'client.pastExperience AS pastExperience',
          'client.about AS about',
          'client.outletId AS outletId',
          'role.id AS role_id',
          'role.name AS role_name',
          'role.scope AS role_scope',
          'role.isSystemDefined AS role_isSystemDefined',
          'role.outletId AS role_outletId',
        ])
        .getRawMany();
    
      // Transform raw results into ExtendedClient instances
      return clientsWithRoles.map((client) => {
        const role = new RoleEntity();
        role.id = client.role_id;
        role.name = client.role_name;
        role.scope = client.role_scope;
        role.isSystemDefined = client.role_isSystemDefined;
        role.outletId = client.role_outletId;
    
        const extendedClient = new ExtendedClient();
        extendedClient.id = client.id;
        extendedClient.name = client.name;
        extendedClient.email = client.email;
        extendedClient.password = client.password;
        extendedClient.contactNumber = client.contactNumber;
        extendedClient.gender = client.gender;
        extendedClient.pastExperience = client.pastExperience;
        extendedClient.about = client.about;
        extendedClient.outletId = client.outletId;
        extendedClient.role = role;
    
        return extendedClient;
      });
    }    
    
}