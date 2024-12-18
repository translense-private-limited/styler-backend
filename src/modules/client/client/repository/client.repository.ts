import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from '../entities/client.entity';
import { getMysqlDataSource } from '@modules/database/data-source';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/utils/repositories/base-repository';
import { TeamMember } from '../dtos/team-member.dto';
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

  async getClientDetails(clientId: number): Promise<TeamMember> {
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
  
      const teamMember = {
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
      return teamMember;
    }
}