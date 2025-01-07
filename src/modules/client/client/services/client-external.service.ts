import { LoginDto } from '@modules/authentication/dtos/login.dto';
import { Injectable } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientEntity } from '../entities/client.entity';
import { RegisterClientDto } from '../dtos/register-client.dto';
import { ResetClientPasswordDto } from '@modules/authentication/dtos/admin-reset-client-password.dto';
import { TeamMember } from '../dtos/team-member.dto';
import { ClientDocsService } from './client-docs-service';

@Injectable()
export class ClientExternalService {
  constructor(private clientService: ClientService,
    private readonly clientDocsService:ClientDocsService
  ) {}

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
    const clients = await this.clientService.getAllTeamMembersForOutlet(outletId);
    return clients;
  }

  // async updateProfilePhoto(clientId: number, newPhotoKey: string): Promise<void> {
  //   // // Fetch existing profile photo
  //   // const client = await this.getClientById(clientId);
  
  //   // // Merge existing profile photo with the new one
  //   // const updatedPhotos = [...(client.profilePhotos || []), newPhotoKey];
  
  //   // // Update the database
  //   // await this.clientRepository.getRepository().update(
  //   //   { id: clientId },
  //   //   { profilePhotos: updatedPhotos }
  //   // );
  // }

  async saveClientPAN(clientId: number, key: string): Promise<void> {
    await this.clientDocsService.saveClientPan(clientId,key)
  }  

  async saveClientAadhaar(clientId: number, key: string): Promise<void> {
    await this.clientDocsService.saveClientAadhaar(clientId,key);
  }

}

