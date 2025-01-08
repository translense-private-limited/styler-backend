import { throwIfNotFound } from '@src/utils/exceptions/common.exception';
import { DeleteOutletDto } from '../dtos/delete-outlet.dto';
import { OutletRepository } from '../repositories/outlet.repository';
import { OutletService } from './outlet.service';
import { ClientRepository } from '@modules/client/client/repository/client.repository';
import { ClientOutletMappingRepository } from '@modules/admin/client-outlet-mapping/repositories/client-outlet-mapping.repository';
import { Injectable } from '@nestjs/common';
import { CreateOutletWithClientDto } from '../dtos/outlet-client.dto';
import { OutletEntity } from '../entities/outlet.entity';
import { RoleEnum } from '@src/utils/enums/role.enums';
import { RoleExternalService } from '@modules/authorization/services/role-external.service';
import { ClientEntity } from '@modules/client/client/entities/client.entity';
import { ClientOutletMappingEntity } from '@modules/admin/client-outlet-mapping/entities/client-outlet-mapping.entity';
import { OutletStatusEnum } from '../enums/outlet-status.enum';
import { ClientExternalService } from '@modules/client/client/services/client-external.service';
import { RegisterClientDto } from '@modules/client/client/dtos/register-client.dto';
import { Not } from 'typeorm';
import { AddressEntity } from '@src/utils/entities/address.entity';
import { CreateOutletDto } from '../dtos/outlet.dto';
import { AddressRepository } from '@src/utils/repositories/address.repository';
import * as csc from 'country-state-city';
import { CityInterface, CountryInterface, StateInterface } from '../interfaces/address.interface';
import { OutletInterface } from '../interfaces/outlet.interface';
import { OutletFilterDto } from '../dtos/outlet-filter.dto';


@Injectable()
export class OutletAdminService {
  constructor(
    private readonly outletRepository: OutletRepository,
    private readonly outletService: OutletService,
    private readonly clientRepository: ClientRepository,
    private readonly clientOutletMappingRepository: ClientOutletMappingRepository,
    private readonly roleExternalService: RoleExternalService,
    private readonly clientExternalService: ClientExternalService,
    private readonly addressRepository: AddressRepository,
  ) {}

  async createOutletWithClient(
    createOutletWithClientDto: CreateOutletWithClientDto,
  ): Promise<{
    message: string;
    outlet: OutletEntity;
    client: ClientEntity;
    address: AddressEntity;
  }> {
    const { client, outlet } = createOutletWithClientDto;
    const { address, ...outletData } = outlet;

    // Start a transaction
    const queryRunner = this.clientRepository
      .getRepository()
      .manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // Validate outlet details
      await this.validateOutletDetails(outletData);

      // Create the outlet first
      const newOutlet = await queryRunner.manager.save(
        OutletEntity,
        outletData,
      );

      // Create the address and associate it with the outlet
      if (!address) {
        throw new Error('Address is required for creating an outlet.');
      }
      address.outletId = newOutlet.id; // Link the outlet ID to the address
      const newAddress = await queryRunner.manager.save(AddressEntity, address);

      //check if the client with the given email and contact number already exists
      await this.validateClientDetails(client);
      // Create the client and associate it with the outlet
      client.outletId = newOutlet.id; // Link the outlet ID to the client
      client.roleId = await this.getOwnerRoleId(); // Assign role ID
      const newClient = await queryRunner.manager.save(ClientEntity, client);

      // Update the outlet with both addressId and clientId
      await queryRunner.manager.update(OutletEntity, newOutlet.id, {
        addressId: newAddress.addressId,
        clientId: newClient.id,
      });

      // Add addressId and clientId to the newOutlet object for response
      newOutlet.addressId = newAddress.addressId;
      newOutlet.clientId = newClient.id;

      // Create client-outlet mapping
      const clientOutletMapping = {
        clientId: newClient.id,
        outletId: newOutlet.id,
      };
      await queryRunner.manager.save(
        ClientOutletMappingEntity,
        clientOutletMapping,
      );

      // Commit transaction
      await queryRunner.commitTransaction();

      return {
        message: 'Outlet, Client, and Address created successfully',
        outlet: newOutlet,
        client: newClient,
        address: newAddress,
      };
    } catch (error) {
      // Rollback transaction in case of error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  private async validateOutletDetails(
    outlet: Partial<OutletEntity>,
  ): Promise<void> {
    if (await this.outletService.getOutletByEmailIdOrThrow(outlet.email)) {
      throw new Error('Outlet with the email already exists');
    }
    if (await this.outletService.getOutletByContactNumber(outlet.phoneNumber)) {
      throw new Error('Outlet with the contact number already exists');
    }
  }
  private async validateClientDetails(
    client: Partial<ClientEntity>,
  ): Promise<void> {
    if (
      await this.clientExternalService.getClientByEmailIdOrThrow(client.email)
    ) {
      throw new Error('Client with the email already exists');
    }
    if (
      await this.clientExternalService.getClientByContactNumber(
        client.contactNumber,
      )
    ) {
      throw new Error('Client with the contact number already exists');
    }
  }
  private async getOwnerRoleId(): Promise<number> {
    const role = await this.roleExternalService.getRoleDetails(RoleEnum.OWNER);
    return role.id;
  }

  async deleteOutletByIdOrThrow(
    outletId: number,
    deleteOutletDto: DeleteOutletDto,
  ): Promise<string> {
    // Ensure confirmation is provided for deletion
    if (!deleteOutletDto.confirmation) {
      throw new Error('Confirmation is required to delete the outlet.');
    }

    // Fetch the outlet to be deleted
    const outlet = await this.outletService.getOutletByIdOrThrow(outletId);
    throwIfNotFound(outlet, `Outlet with ID ${outletId} not found`);

    // Fetch the clients associated with this outlet from the ClientOutletMapping table
    const clientOutletMappings = await this.clientOutletMappingRepository
      .getRepository()
      .find({
        where: { outletId: outletId },
      });

    const outletAddress = await this.addressRepository
      .getRepository()
      .findOne({ where: { addressId: outlet.addressId } });
    // If there are clients associated with this outlet, delete them from the ClientEntity
    if (clientOutletMappings.length > 0) {
      for (const mapping of clientOutletMappings) {
        // Delete the client associated with the outlet
        const client = await this.clientRepository.getRepository().findOne({
          where: { id: mapping.clientId },
        });
        if (client) {
          await this.clientRepository.getRepository().remove(client);
        }
        // Delete the mapping from ClientOutletMapping
        await this.clientOutletMappingRepository
          .getRepository()
          .remove(mapping);
      }
    }
    await this.addressRepository.getRepository().remove(outletAddress);
    await this.outletRepository.getRepository().remove(outlet);
    return 'Outlet and associated clients deleted successfully';
  }

  async getAllOutlets(filterDto:OutletFilterDto): Promise<OutletInterface[]> {
    return this.outletService.getAllOutlets(filterDto);
  }

  async updateOutletByIdOrThrow(
    outletId: number,
    updateData: Partial<CreateOutletDto>,
  ): Promise<CreateOutletDto> {
    // Fetch the outlet
    const outlet = await this.outletService.getOutletByIdOrThrow(outletId);
    const address = await this.addressRepository
      .getRepository()
      .findOne({ where: { outletId } });
    throwIfNotFound(outlet, `Outlet with ID ${outletId} not found`);

    // If there's no data to update, return the existing outlet and address
    if (Object.keys(updateData).length === 0) {
      return outlet;
    }

    // Check for conflicting fields
    const conflictingFields = await this.checkForConflicts(
      updateData,
      outletId,
    );
    if (conflictingFields) {
      throw new Error(
        `An outlet already exists with the provided ${conflictingFields}`,
      );
    }

    let savedAddress = address;

    // Update address if provided in updateData
    if (updateData.address) {
      if (!address) {
        throw new Error('Address not found for the given outlet');
      }
      const updatedAddress = Object.assign(address, updateData.address);
      savedAddress = await this.addressRepository
        .getRepository()
        .save(updatedAddress);
    }
    // Merge other updateData fields with the outlet entity
    const updatedOutlet = Object.assign(outlet, updateData);

    // Save the updated outlet entity
    const savedOutlet = await this.outletRepository
      .getRepository()
      .save(updatedOutlet);

    // Return both the updated outlet and address
    savedOutlet.address = savedAddress;
    return savedOutlet;
  }

  private async checkForConflicts(
    updateData: Partial<CreateOutletDto>,
    outletId: number,
  ): Promise<string | null> {
    if (updateData.email) {
      const existedOutletWithEmail = await this.checkIfOutletExistsWithEmail(
        updateData.email,
        outletId,
      );
      if (existedOutletWithEmail) {
        return 'email';
      }
    }

    if (updateData.phoneNumber) {
      const existedOutletWithContactNumber =
        await this.checkIfOutletExistsWithContactNumber(
          updateData.phoneNumber,
          outletId,
        );
      if (existedOutletWithContactNumber) {
        return 'contact number';
      }
    }

    return null;
  }

  async updateOutletStatus(
    outletId: number,
    status: OutletStatusEnum,
  ): Promise<OutletEntity> {
    const outlet = await this.outletService.getOutletByIdOrThrow(outletId);
    throwIfNotFound(outlet, `outlet not found`);

    outlet.status = status;
    return await this.outletRepository.getRepository().save(outlet);
  }

  async addClientToAnExistingOutlet(
    outletId: number,
    registerClientDto: RegisterClientDto,
  ): Promise<ClientEntity> {
    //check if outlet exists
    await this.outletService.getOutletByIdOrThrow(outletId);
    const clientData = {
      ...registerClientDto,
      outletId,
    };
    return await this.clientExternalService.createClient(clientData);
  }
  async checkIfOutletExistsWithEmail(
    email: string,
    outletId: number,
  ): Promise<OutletEntity> {
    return await this.outletRepository.getRepository().findOne({
      where: {
        email,
        id: Not(outletId),
      },
    });
  }

  async checkIfOutletExistsWithContactNumber(
    contactNumber: string,
    outletId,
  ): Promise<OutletEntity> {
    return await this.outletRepository.getRepository().findOne({
      where: {
        phoneNumber: contactNumber,
        id: Not(outletId),
      },
    });
  }

  getAllCountries():CountryInterface[]{
    return csc.Country.getAllCountries();
  }

  getStatesByCountry(countryCode: string):StateInterface[]{
    return csc.State.getStatesOfCountry(countryCode);
  }

  getCitiesByState(countryCode: string, stateCode: string):CityInterface[] {
    return csc.City.getCitiesOfState(countryCode, stateCode);
  }
}
