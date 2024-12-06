import { LoginDto } from '@modules/authentication/dtos/login.dto';
import { Injectable } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientEntity } from '../entities/client.entity';
import { CreateClientDto } from '../dtos/client.dto';

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

  async createClient(data: CreateClientDto): Promise<ClientEntity> {
    
    return 
  }
  
}
