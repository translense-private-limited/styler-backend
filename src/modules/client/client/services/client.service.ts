import { ExtendedClient } from '../dtos/extended-client.dto';
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

import { throwIfNotFound } from '@src/utils/exceptions/common.exception';
import { ResetClientPasswordDto } from '@modules/authentication/dtos/admin-reset-client-password.dto';
import { RegisterClientDto } from '../dtos/register-client.dto';
import { RoleExternalService } from '@modules/authorization/services/role-external.service';
import { ClientOutletMappingEntity } from '@modules/admin/client-outlet-mapping/entities/client-outlet-mapping.entity';

@Injectable()
export class ClientService {
  constructor(
    private clientRepository: ClientRepository,
    private roleClientService: RoleClientService,
    private bcryptEncryptionService: BcryptEncryptionService,
    private readonly roleExternalService: RoleExternalService,
  ) {}

  async getExtendedClientById(
    clientId: number,
    clientIdDto: ClientIdDto,
  ): Promise<ExtendedClient> {
    try {
      const { outletIds } = clientIdDto;
      const extendedClient = await this.getClientByIdOrThrow(clientId);

      if (!outletIds.includes(extendedClient.outletId)) {
        throw new UnauthorizedException('You are not authorized');
      }

      const role = await this.roleClientService.getRoleByIdOrThrow(
        extendedClient.roleId,
      );
      return { ...extendedClient, role };
    } catch (error) {
      throw new HttpException(
        'An unexpected error occurred.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

  async createExtendedClient(
    createClientDto: CreateClientDto,
    clientIdDto: ClientIdDto,
  ): Promise<ExtendedClient> {
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

  async getClientByContactNumber(
    contactNumber: string,
  ): Promise<ClientEntity | null> {
    return this.clientRepository.getRepository().findOneBy({ contactNumber });
  }

  async resetClientPassword(
    clientId: number,
    resetPasswordDto: ResetClientPasswordDto,
  ): Promise<String> {
    const { password } = resetPasswordDto;

    const encryptedPassword =
      await this.bcryptEncryptionService.encrypt(password);

    const client = await this.getClientById(clientId);

    throwIfNotFound(client, 'client not found');

    client.password = encryptedPassword;

    // Save the updated client data
    await this.clientRepository.getRepository().save(client);

    return 'Password successfully reset';
  }

  async createClient(clientDto: RegisterClientDto): Promise<ClientEntity> {
    const queryRunner = this.clientRepository
      .getRepository()
      .manager.connection.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      // Check if a client with the provided email already exists
      const getClientWithProvidedEmail = await this.getClientByEmailOrThrow(
        clientDto.email,
      );
      if (getClientWithProvidedEmail) {
        throw new Error('Client with given email already exists');
      }

      // Check if a client with the provided contact number already exists
      const getClientWithContactNumber = await this.getClientByContactNumber(
        clientDto.contactNumber,
      );
      if (getClientWithContactNumber) {
        throw new Error('Client with given contact number already exists');
      }

      // Encrypt the password if it is provided, or use a default encrypted password (e.g., encrypted name)
      const encryptedPassword = clientDto.password
        ? await this.bcryptEncryptionService.encrypt(clientDto.password)
        : await this.bcryptEncryptionService.encrypt(clientDto.name);

      // Prepare the client data to be saved
      const clientDataToSave = {
        ...clientDto,
        password: encryptedPassword,
      };

      // Save the client data in the database
      const newClient = await queryRunner.manager.save(
        ClientEntity,
        clientDataToSave,
      );

      // Create client-outlet mapping
      const clientOutletMapping = {
        clientId: newClient.id,
        outletId: clientDto.outletId,
      };

      await queryRunner.manager.save(
        ClientOutletMappingEntity,
        clientOutletMapping,
      );

      // Commit transaction
      await queryRunner.commitTransaction();

      return newClient;
    } catch (error) {
      // Rollback transaction in case of error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async getAllExtendedClientsForOutlet(outletId: number): Promise<ExtendedClient[]> {
    return await this.clientRepository.getClientsByOutletId(outletId);
  }

}
