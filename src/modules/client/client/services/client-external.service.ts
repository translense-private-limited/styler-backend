import { LoginDto } from '@modules/authentication/dtos/login.dto';
import { Injectable } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientEntity } from '../entities/client.entity';
import { RegisterClientDto } from '../dtos/register-client.dto';
import { ResetClientPasswordDto } from '@modules/authentication/dtos/admin-reset-client-password.dto';
import { TeamMember } from '../dtos/team-member.dto';

@Injectable()
export class ClientExternalService {
  constructor(private clientService: ClientService) {}

  async getSellers(loginDto: LoginDto): Promise<ClientEntity> {
    return await this.clientService.getSellerByEmail(loginDto);
  }

  async getClientById(clientId: number): Promise<ClientEntity> {
    const client = await this.clientService.getClientById(clientId);
    return client;
  }

  async createClient(clientDto: RegisterClientDto): Promise<ClientEntity> {
    return this.clientService.createClient(clientDto);
  }

  async resetClientPassword(
    clientId: number,
    resetClientPasswordDto: ResetClientPasswordDto,
  ): Promise<String> {
    return this.clientService.resetClientPassword(
      clientId,
      resetClientPasswordDto,
    );
  }

  async getClientByEmailIdOrThrow(email: string): Promise<ClientEntity> {
    return await this.clientService.getClientByEmailOrThrow(email);
  }

  async getClientByContactNumber(contactNumber: string): Promise<ClientEntity> {
    return await this.clientService.getClientByContactNumber(contactNumber);
  }

  async getClientByOutlet(outletId: number): Promise<TeamMember[]> {
    const clients = await this.clientService.getClientsByOutletId(outletId);
    return clients;
  }
}

