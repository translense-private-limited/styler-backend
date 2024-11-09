import { LoginDto } from '@modules/atuhentication/dtos/login.dto';
import { Injectable } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientEntity } from '../entities/client.entity';

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
}
