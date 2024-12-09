import { LoginDto } from '@modules/authentication/dtos/login.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientEntity } from '../entities/client.entity';
import { ClientRepository } from '../repository/client.repository';
import { BcryptEncryptionService } from '@modules/encryption/services/bcrypt-encryption.service';
import { RoleExternalService } from '@modules/authorization/services/role-external.service';
import { RoleEnum } from '@src/utils/enums/role.enums';
import { RegisterClientDto } from '../dtos/register-client.dto';
import { ResetClientPasswordDto } from '@modules/authentication/dtos/admin-reset-client-password.dto';

@Injectable()
export class ClientExternalService {
  constructor(private clientService: ClientService,
    private readonly clientRepository:ClientRepository,
    private readonly bcryptEncryptionService:BcryptEncryptionService,
    private readonly roleExternalService:RoleExternalService
  ) {}

  async getSellers(loginDto: LoginDto): Promise<ClientEntity> {
    return await this.clientService.getSellerByEmail(loginDto);
  }

  async getClientById(clientId: number): Promise<ClientEntity> {
    const client = await this.clientService.getClientById(clientId);
    return client;
  }

  async createClient(clientDto: RegisterClientDto): Promise<ClientEntity> {
    // Check if a client with the provided email already exists
    const getClientWithProvidedEmail = await this.clientService.getClientByEmailOrThrow(clientDto.email);
  
    // Check if a client with the provided contact number already exists
    const getClientWithContactNumber = await this.clientService.getClientByContactNumber(clientDto.contactNumber);
  
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
  
  async resetClientPassword(clientId: number, resetClientPasswordDto: ResetClientPasswordDto):Promise<String> {
    return this.resetClientPassword(clientId,resetClientPasswordDto)
  }
}

