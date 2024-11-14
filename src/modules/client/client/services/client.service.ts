import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { CreateClientDto } from '../dtos/client.dto';
import { ClientRepository } from '../repository/client.repository';
import { BcryptEncryptionService } from '@modules/encryption/services/bcrypt-encryption.service';
import { SellerLoginDto } from '@modules/atuhentication/dtos/seller-login.dto';
import { ClientEntity } from '../entities/client.entity';
import { ClientIdDto } from '@src/utils/dtos/client-id.dto';
import { RoleClientService } from '@modules/authorization/services/role-client.service';
import { In } from 'typeorm';
import { TeamMemberRole } from '../dtos/team-role.dto';

@Injectable()
export class ClientService {
  constructor(
    private clientRepository: ClientRepository,
    private roleClientService:RoleClientService,
    private bcryptEncryptionService: BcryptEncryptionService,
  ) {}
  
  async getTeamByIdOrThrow(clientId: number,clientIdDto:ClientIdDto):Promise<ClientEntity> {
    try {

      const {outletIds} = clientIdDto;
      const teamMember = await this.clientRepository.getRepository().findOne({ where: { id: clientId ,outletId: In(outletIds)} });
      return teamMember;
    } catch (error) {
      console.error('Error fetching team member:', error);
  
      throw new HttpException('An unexpected error occurred.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  
  
  async getAllTeamMembersForOutlet(outletId: number):Promise<ClientEntity[]> {
    try {
      const teamMembers = await this.clientRepository
        .getRepository()
        .createQueryBuilder('client')
        .where('client.outletId = :outletId', { outletId })
        .getMany();
  
      return teamMembers;
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


  async createTeamMember(createClientDto: CreateClientDto, clientIdDto: ClientIdDto):Promise<TeamMemberRole> {

    await this.checkSellerUniqueness(createClientDto);

    if (!clientIdDto.outletIds.includes(createClientDto.outletId)){ 
      throw new UnauthorizedException('Outlet permission denied.');
    }

    const role = await this.roleClientService.getRoleByIdOrThrow(createClientDto.roleId);
    if (!role) {
      throw new HttpException('Role not found.', HttpStatus.BAD_REQUEST);
    }

    // Set and encrypt password
    createClientDto.password = createClientDto.password || createClientDto.name || 'password';
    const plainPassword = createClientDto.password;
    const encryptedPassword = await this.getEncryptedPassword(createClientDto);
    createClientDto.password = encryptedPassword;
  
    // Save client and return response with original password
    const client = await this.clientRepository.getRepository().save(createClientDto);
    return { client, password: plainPassword,role:role };
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
