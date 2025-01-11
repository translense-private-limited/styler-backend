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

import { ExtendedClient } from '../dtos/extended-client.dto';
import { DeleteResult } from 'typeorm';

@Injectable()
export class ExtendedClientService {
  constructor(
    private clientRepository: ClientRepository,
    private roleClientService: RoleClientService,
    private bcryptEncryptionService: BcryptEncryptionService,
  ) {}

  async updateExtendedClient(
    ExtendedClientId: number,
    updateDto: Partial<ClientEntity>,
  ): Promise<ExtendedClient> {
    const extendedClient = await this.getExtendedClientByIdOrThrow(ExtendedClientId);

    // make sure password will not be updated
    delete updateDto.password;

    // make sure existing email id is not used ,
    if (updateDto.email) {
      const extendedClient = await this.clientRepository
        .getRepository()
        .findOne({ where: { email: updateDto.email } });
      if (extendedClient) {
        throw new BadRequestException(
          `Client registered with ${updateDto.email}, please provide different email`,
        );
      }
    }

    let role;

    // check is role going to be updated
    if (updateDto.roleId !== extendedClient.roleId) {
      role = await this.roleClientService.getRoleByIdOrThrow(updateDto.roleId);
    }

    const updateClientInstance = Object.assign(ExtendedClient, updateDto);

    const updatedExtendedClient = await this.clientRepository
      .getRepository()
      .save(updateClientInstance);

    return { ...updatedExtendedClient, role: role };
  }

  async deleteExtendedClient(
    ExtendedClientId: number,
    clientIdDto: ClientIdDto,
  ): Promise<DeleteResult> {
    const extendedClient = await this.getExtendedClientByIdOrThrow(ExtendedClientId);

    if (!clientIdDto.outletIds.includes(extendedClient.outletId)) {
      throw new UnauthorizedException('You are not allowed the team member');
    }

    return this.clientRepository.getRepository().delete({ id: ExtendedClientId });
  }

  async getExtendedClientByIdOrThrow(ExtendedClientId: number): Promise<ClientEntity> {
    const extendedClient = await this.clientRepository.getRepository().findOne({
      where: {
        id: ExtendedClientId,
      },
    });
    if (!extendedClient) {
      throw new NotFoundException('No team member exist ');
    }
    return extendedClient;
  }
}
