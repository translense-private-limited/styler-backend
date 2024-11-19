import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { ClientRepository } from '../repository/client.repository';
import { BcryptEncryptionService } from '@modules/encryption/services/bcrypt-encryption.service';

import { ClientEntity } from '../entities/client.entity';
import { ClientIdDto } from '@src/utils/dtos/client-id.dto';
import { RoleClientService } from '@modules/authorization/services/role-client.service';

import { TeamMember } from '../dtos/team-member.dto';
import { DeleteResult } from 'typeorm';

@Injectable()
export class TeamMemberService {
  constructor(
    private clientRepository: ClientRepository,
    private roleClientService: RoleClientService,
    private bcryptEncryptionService: BcryptEncryptionService,
  ) {}

  async updateTeamMember(
    teamMemberId: number,
    updateDto: Partial<ClientEntity>,
  ): Promise<TeamMember> {
    const teamMember = await this.getTeamMemberByIdOrThrow(teamMemberId);

    // make sure password will not be updated
    delete updateDto.password;

    // make sure existing email id is not used ,
    if (updateDto.email) {
      const teamMember = await this.clientRepository
        .getRepository()
        .findOne({ where: { email: updateDto.email } });
      if (teamMember) {
        throw new BadRequestException(
          `Client registered with ${updateDto.email}, please provide different email`,
        );
      }
    }

    let role;

    // check is role going to be updated
    if (updateDto.roleId !== teamMember.roleId) {
      role = await this.roleClientService.getRoleByIdOrThrow(updateDto.roleId);
    }

    const updateClientInstance = Object.assign(teamMember, updateDto);

    const updatedTeamMember = await this.clientRepository
      .getRepository()
      .save(updateClientInstance);

    return { ...updatedTeamMember, role: role };
  }

  async deleteTeamMember(
    teamMemberId: number,
    clientIdDto: ClientIdDto,
  ): Promise<DeleteResult> {
    const teamMember = await this.getTeamMemberByIdOrThrow(teamMemberId);

    if (!clientIdDto.outletIds.includes(teamMember.outletId)) {
      throw new UnauthorizedException('You are not allowed the team member');
    }

    return this.clientRepository.getRepository().delete({ id: teamMemberId });
  }

  async getTeamMemberByIdOrThrow(teamMemberId: number): Promise<ClientEntity> {
    const teamMember = await this.clientRepository.getRepository().findOne({
      where: {
        id: teamMemberId,
      },
    });
    if (!teamMember) {
      throw new NotFoundException('No team member exist ');
    }
    return teamMember;
  }
}
