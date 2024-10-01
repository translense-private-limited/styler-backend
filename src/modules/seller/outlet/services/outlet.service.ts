import { Injectable,NotFoundException } from '@nestjs/common';

import { OutletRepository } from '../repositories/outlet.repository';
import { CreateOutletDto } from '../dtos/outlet.dto';
import { OutletEntity } from '../entities/outlet.entity';

@Injectable()
export class OutletService {
    constructor(private outletRepository: OutletRepository) { }

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

    async getOutletById(id: string): Promise<OutletEntity> {
        const outletId = parseInt(id, 10); // Convert the id to a number
        const outlet = await this.outletRepository.getRepository().findOne({ where: { id: outletId } });
        
        if (!outlet) {
            throw new NotFoundException(`Outlet with ID ${id} not found`);
        }
        return outlet;
    }

    async updateOutlet(id: string, updateOutletDto: Partial<CreateOutletDto>): Promise<OutletEntity> {
        const outletId = parseInt(id, 10);
        const outlet = await this.outletRepository.getRepository().findOne({ where: { id: outletId } });

        if (!outlet) {
            throw new NotFoundException(`Outlet with ID ${id} not found`);
        }

        // Merge updated data
        Object.assign(outlet, updateOutletDto);
        return await this.outletRepository.getRepository().save(outlet);
    }

    // Method to delete an outlet by ID
    async deleteOutlet(id: string): Promise<void> {
        const outletId = parseInt(id, 10);
        const result = await this.outletRepository.getRepository().delete(outletId);

        if (result.affected === 0) {
            throw new NotFoundException(`Outlet with ID ${id} not found`);
        }
    }
}
