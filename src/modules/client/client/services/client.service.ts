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
import { SellerLoginDto } from '@modules/authentication/dtos/seller-login.dto';
import { ClientEntity } from '../entities/client.entity';
import { ClientIdDto } from '@src/utils/dtos/client-id.dto';
import { RoleClientService } from '@modules/authorization/services/role-client.service';
import { TeamMember } from '../dtos/team-member.dto';
import { throwIfNotFound } from '@src/utils/exceptions/common.exception';
import { ResetClientPasswordDto } from '@modules/authentication/dtos/admin-reset-client-password.dto';
import { RoleEnum } from '@src/utils/enums/role.enums';
import { RegisterClientDto } from '../dtos/register-client.dto';
import { RoleExternalService } from '@modules/authorization/services/role-external.service';


@Injectable()
export class ClientService {
  constructor(
    private clientRepository: ClientRepository,
    private roleClientService: RoleClientService,
    private bcryptEncryptionService: BcryptEncryptionService,
    private readonly roleExternalService:RoleExternalService
    
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


  async getClientByEmailOrThrow(email: string): Promise<ClientEntity | null> {
    return this.clientRepository.getRepository().findOneBy({ email });
  }

  async getClientByContactNumber(contactNumber: string): Promise<ClientEntity | null> {
    return this.clientRepository.getRepository().findOneBy({ contactNumber });
  }

  async resetClientPassword(clientId: number, resetPasswordDto: ResetClientPasswordDto):Promise<String> {
    const { password } = resetPasswordDto;

    const encryptedPassword = await this.bcryptEncryptionService.encrypt(password);

    const client = await this.getClientById(clientId)

    throwIfNotFound(client,'client not found')

    client.password = encryptedPassword;

    // Save the updated client data
    await this.clientRepository.getRepository().save(client);

    return 'Password successfully reset';
  }

  async createClient(clientDto: RegisterClientDto): Promise<ClientEntity> {
    // Check if a client with the provided email already exists
    const getClientWithProvidedEmail = await this.getClientByEmailOrThrow(clientDto.email);
  
    // Check if a client with the provided contact number already exists
    const getClientWithContactNumber = await this.getClientByContactNumber(clientDto.contactNumber);
  
    // Throw an exception if either the email or contact number already exists
    if (getClientWithContactNumber || getClientWithProvidedEmail) {
      throw new BadRequestException('User already exists with the provided details');
    }
  
    // Encrypt the password if it is provided, or use a default encrypted password (e.g., encrypted name)
    const encryptedPassword = clientDto.password 
      ? await this.bcryptEncryptionService.encrypt(clientDto.password)
      : await this.bcryptEncryptionService.encrypt(clientDto.name);
  
    // Retrieve the default role for clients
    const role = await this.roleExternalService.getRoleDetails(RoleEnum.OWNER);
    const roleId = role.id;
  
    // Prepare the client data to be saved
    const clientDataToSave = {
      ...clientDto,
      password: encryptedPassword,
      roleId,
    };
  
    // Save the client data in the database
    return this.clientRepository.getRepository().save(clientDataToSave);
  }
     
  
}
