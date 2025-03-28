import { Injectable } from '@nestjs/common';

import { OutletRepository } from '../repositories/outlet.repository';
import { CreateOutletDto } from '../dtos/outlet.dto';
import { OutletEntity } from '../entities/outlet.entity';
import { throwIfNotFound } from '@src/utils/exceptions/common.exception';
import { DeleteOutletDto } from '../dtos/delete-outlet.dto';
import { OutletInterface } from '../interfaces/outlet.interface';
import { In } from 'typeorm';
import { OutletFilterDto } from '../dtos/outlet-filter.dto';

@Injectable()
export class OutletService {
  constructor(
    private outletRepository: OutletRepository,

  ) { }

  async createOutlet(createAddressDto: CreateOutletDto): Promise<OutletEntity> {
    const outlet = await this.outletRepository
      .getRepository()
      .save(createAddressDto);
    return outlet;
  }

  // Fetch all outlets
  async getAllOutlets(filterDto: OutletFilterDto): Promise<OutletInterface[]> {
    return this.outletRepository.getAllOutletsWithOwner(filterDto);
  }

  async getOutletByIdOrThrow(outletId: number): Promise<OutletEntity> {
    const outlet = await this.outletRepository
      .getRepository()
      .findOne({
        where: { id: outletId },
        relations: ['address']
      });

    throwIfNotFound(outlet, `outlet with ${outletId} not found`)
    return outlet;
  }

  async deleteOutletByIdOrThrow(outletId: number, deleteOutletDto: DeleteOutletDto): Promise<string> {

    if (!deleteOutletDto.confirmation) {
      throw new Error('Confirmation is required to delete the outlet.');
    }

    const outlet = await this.outletRepository.getRepository().findOne({
      where: { id: outletId },
    });
    throwIfNotFound(outlet, `Outlet with ID ${outletId} not found`)

    await this.outletRepository.getRepository().remove(outlet);

    return "outlet deleted successfully";
  }

  async getOutletByEmailIdOrThrow(email: string): Promise<OutletEntity> {
    return await this.outletRepository.getRepository().findOne({ where: { email } });
  }

  async getOutletByContactNumber(contactNumber: string): Promise<OutletEntity> {
    return await this.outletRepository.getRepository().findOne({ where: { phoneNumber: contactNumber } })
  }

  async getOutletDetailsByIds(outletIds: number[]): Promise<OutletEntity[]> {
    return this.outletRepository.getRepository().find({
      where: { id: In(outletIds) },
      relations: ['address']
    })
  }



}


