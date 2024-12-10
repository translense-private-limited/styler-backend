import { Injectable, NotFoundException } from '@nestjs/common';

import { OutletRepository } from '../repositories/outlet.repository';
import { CreateOutletDto } from '../dtos/outlet.dto';
import { OutletEntity } from '../entities/outlet.entity';
import { throwIfNotFound } from '@src/utils/exceptions/common.exception';
import { DeleteOutletDto } from '../dtos/delete-outlet.dto';

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

  async deleteOutletByIdOrThrow(outletId: number,deleteOutletDto:DeleteOutletDto): Promise<string> {

    if (!deleteOutletDto.confirmation) {
      throw new Error('Confirmation is required to delete the outlet.');
    }

    const outlet = await this.outletRepository.getRepository().findOne({
      where: { id: outletId },
    });
    throwIfNotFound(outlet,`Outlet with ID ${outletId} not found`)

    await this.outletRepository.getRepository().remove(outlet);

    return "outlet deleted successfully";
  }

  async getOutletByEmailIdOrThrow(emailId:string):Promise<OutletEntity>{
      const outlet =  await this.outletRepository.getRepository().findOne({where:{email:emailId}})
      return outlet;
  }

  async getOutletByContactNumber(contactNumber:string):Promise<OutletEntity>{
      return await this.outletRepository.getRepository().findOne({where:{phoneNumber:contactNumber}});
  }

}

