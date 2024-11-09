import { Injectable, NotFoundException } from '@nestjs/common';

import { OutletRepository } from '../repositories/outlet.repository';
import { CreateOutletDto } from '../dtos/outlet.dto';
import { OutletEntity } from '../entities/outlet.entity';

@Injectable()
export class OutletService {
  constructor(private outletRepository: OutletRepository) {}

  async createOutlet(createAddressDto: CreateOutletDto): Promise<OutletEntity> {
    const outlet = await this.outletRepository
      .getRepository()
      .save(createAddressDto);
    return outlet;
  }

  // Fetch all outlets
  async getAllOutlets(): Promise<OutletEntity[]> {
    return this.outletRepository.getRepository().find();
  }

  async getOutletByIdOrThrow(outletId: number): Promise<OutletEntity> {
    const outlet = await this.outletRepository
      .getRepository()
      .findOne({ where: { id: outletId } });

    if (!outlet) {
      throw new NotFoundException(`Outlet with ID ${outletId} not found`);
    }
    return outlet;
  }

  async getOutletById(outletId: number): Promise<OutletEntity> {
    return this.getOutletByIdOrThrow(outletId);
  }
}
