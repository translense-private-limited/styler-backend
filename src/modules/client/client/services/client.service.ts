import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateClientDto } from '../dtos/client.dto';
import { ClientRepository } from '../repository/client.repository';
import { BcryptEncryptionService } from '@modules/encryption/services/bcrypt-encryption.service';
import { SellerLoginDto } from '@modules/atuhentication/dtos/seller-login.dto';
import { ClientEntity } from '../entities/client.entity';
import { ClientIdDto } from '@src/utils/dtos/client-id.dto';
import { RoleClientService } from '@modules/authorization/services/role-client.service';

import { TeamMember } from '../dtos/team-member.dto';
import { UpdateClientDto } from '../dtos/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    private clientRepository: ClientRepository,
    private roleClientService: RoleClientService,
    private bcryptEncryptionService: BcryptEncryptionService,
  ) {}

  async getTeamMemberById(
    clientId: number,
    clientIdDto: ClientIdDto,
  ): Promise<TeamMember> {
    try {
      const { outletIds } = clientIdDto;
      const teamMember = await this.getClientByIdOrThrow(clientId);

      if (!outletIds.includes(teamMember.outletId)) {
        throw new UnauthorizedException('You are not authorized');
      }

      const role = await this.roleClientService.getRoleByIdOrThrow(
        teamMember.roleId,
      );
      return { ...teamMember, role };
    } catch (error) {
      console.error('Error fetching team member:', error);

      throw new HttpException(
        'An unexpected error occurred.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllTeamMembersForOutlet(outletId: number): Promise<TeamMember[]> {
    try {
      const teamMembers = await this.clientRepository
        .getRepository()
        .find({ where: { outletId } });

      const roleIds = teamMembers.map((teamMember) => teamMember.roleId);

      const roles = await this.roleClientService.getRoleByRoleIds(roleIds);

      return teamMembers.map((teamMember) => {
        const teamMemberInstance = new TeamMember();
        teamMemberInstance.role = roles.find(
          (role) => role.id === teamMember.roleId,
        );
        delete teamMember.roleId;
        Object.assign(teamMemberInstance, teamMember);
        return teamMemberInstance;
      });
    } catch (error) {
      console.error('Error retrieving team members:', error);
      throw new Error('An error occurred while fetching team members');
    }
  }

  private async getEncryptedPassword(
    createClientDto: CreateClientDto,
  ): Promise<string> {
    const { password } = createClientDto;
    return await this.bcryptEncryptionService.encrypt(password);
  }

  private async checkSellerUniqueness(
    createClientDto: CreateClientDto,
  ): Promise<void> {
    const seller = await this.clientRepository
      .getRepository()
      .findOne({ where: { email: createClientDto.email } });
    if (seller) {
      throw new BadRequestException(
        `Seller exists with provided email, please try with unique email`,
      );
    }
  }

  async createTeamMember(
    createClientDto: CreateClientDto,
    clientIdDto: ClientIdDto,
  ): Promise<TeamMember> {
    await this.checkSellerUniqueness(createClientDto);

    if (!clientIdDto.outletIds.includes(createClientDto.outletId)) {
      throw new UnauthorizedException('Outlet permission denied.');
    }

    const role = await this.roleClientService.getRoleByIdOrThrow(
      createClientDto.roleId,
    );
    if (!role) {
      throw new HttpException('Role not found.', HttpStatus.BAD_REQUEST);
    }

    // Set and encrypt password
    createClientDto.password =
      createClientDto.password || createClientDto.name || 'password';
    const plainPassword = createClientDto.password;
    const encryptedPassword = await this.getEncryptedPassword(createClientDto);
    createClientDto.password = encryptedPassword;

    // Save client and return response with original password
    const client = await this.clientRepository
      .getRepository()
      .save(createClientDto);
    delete client.roleId;
    return { ...client, password: plainPassword, role: role };
  }

  async updateTeamMember(
    updateClientDto: UpdateClientDto,
    clientIdDto: ClientIdDto,
    clientId: number,
  ): Promise<TeamMember> {
    // Fetch the existing client
    const teamMember = await this.clientRepository
      .getRepository()
      .findOne({ where: { id: clientId } });
    if (!teamMember) {
      throw new NotFoundException('Team member not found.');
    }
  
    // Ensure the client has permission to modify the team member
    if (!clientIdDto.outletIds.includes(teamMember.outletId)) {
      throw new UnauthorizedException('Outlet permission denied.');
    }
  
    // Check role if it's being updated
    if (updateClientDto.roleId) {
      const role = await this.roleClientService.getRoleByIdOrThrow(
        updateClientDto.roleId,
      );
      if (!role) {
        throw new HttpException('Role not found.', HttpStatus.BAD_REQUEST);
      }
    }
    
    if (
      updateClientDto.outletId &&
      updateClientDto.outletId !== teamMember.outletId
    ) {
      throw new BadRequestException('Updating outletId is not allowed');
    }
    // If password is being updated, encrypt the new password
    if (updateClientDto.password) {
      updateClientDto.password = await this.getEncryptedPassword({
        ...teamMember,
        password: updateClientDto.password,
      });
    }
  
    // Merge the updates into the existing client object
    const updatedClient = this.clientRepository.getRepository().merge(
      teamMember,
      updateClientDto,
    );
  
    // Save the updated client entity
    const savedClient = await this.clientRepository
      .getRepository()
      .save(updatedClient);
  
    // Remove sensitive fields and include role details if updated
    delete savedClient.roleId;
    const role =
      updateClientDto.roleId &&
      (await this.roleClientService.getRoleByIdOrThrow(updateClientDto.roleId));
  
    return { ...savedClient, role };
  }
  
  async deleteTeamMember(teamMemberId: number, clientIdDto: ClientIdDto): Promise<void> {
    const teamMember = await this.clientRepository.getRepository().findOne({
      where: { id: teamMemberId },
    });
  
    if (!teamMember) {
      throw new NotFoundException('Team member not found.');
    }
  
    if (!clientIdDto.outletIds.includes(teamMember.outletId)) {
      throw new UnauthorizedException('You do not have permission to delete this team member.');
    }
  
    await this.clientRepository.getRepository().delete(teamMemberId);
  }

  async deleteAllTeamMembersForOutlet(
    outletId: number,
    clientIdDto: ClientIdDto,
  ): Promise<void> {

    if (!clientIdDto.outletIds.includes(outletId)) {
      throw new UnauthorizedException('Outlet permission denied.');
    }
  
    const teamMembers = await this.getAllTeamMembersForOutlet(outletId);
  
    // Extract team member IDs for deletion
    const teamMemberIds = teamMembers.map((teamMember) => teamMember.id);
  
    // Perform the deletion
    await this.clientRepository.getRepository().delete(teamMemberIds);
  }
  
  async getSellerByEmail(
    sellerLoginDto: SellerLoginDto,
  ): Promise<ClientEntity> {
    const { username } = sellerLoginDto;

    const seller = await this.clientRepository
      .getRepository()
      .findOne({ where: { email: username } });
    if (!seller) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return seller;
  }

  private async getClientByIdOrThrow(clientId: number): Promise<ClientEntity> {
    const client = await this.clientRepository
      .getRepository()
      .findOne({ where: { id: clientId } });

    if (!client) {
      throw new NotFoundException(`Outlet with ID ${clientId} not found`);
    }
    return client;
  }

  async getClientById(clientId: number): Promise<ClientEntity> {
    return this.getClientByIdOrThrow(clientId);
  }
}
