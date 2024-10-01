import { Injectable, NotFoundException } from '@nestjs/common';
import { OutletRepository } from '../repositories/outlet.repository';
import { CreateOutletDto } from '../dtos/outlet.dto';
import { OutletEntity } from '../entities/outlet.entity';

@Injectable()
export class OutletService {
    constructor(private readonly outletRepository: OutletRepository) { }

    // Create a new outlet
    async createOutlet(createOutletDto: CreateOutletDto): Promise<OutletEntity> {
        return await this.outletRepository.getRepository().save(createOutletDto);
    }

    // Fetch all outlets
    async getAllOutlets(): Promise<OutletEntity[]> {
        return this.outletRepository.getRepository().find();
    }

    // Get outlet by ID
    async getOutletById(id: number): Promise<OutletEntity> {
        const outlet = await this.outletRepository.getRepository().findOne({ where: { id } });

        if (!outlet) {
            throw new NotFoundException(`Outlet with ID ${id} not found.`);
        }
        return outlet;
    }


    // Find outlet by ID or throw an exception
    async findByIdOrThrow(id: number): Promise<OutletEntity> {
        const outlet = await this.outletRepository.getRepository().findOne({ where: { id } });
        if (!outlet) {
            throw new NotFoundException(`Outlet with ID ${id} not found.`);
        }
        return outlet;
    }

    // Update outlet
    async updateOutlet(id: number, updateOutletDto: Partial<CreateOutletDto>): Promise<OutletEntity> {
        const outlet = await this.findByIdOrThrow(id);
        Object.assign(outlet, updateOutletDto);
        return await this.outletRepository.getRepository().save(outlet);
    }

    // Delete outlet by ID
    async deleteOutlet(id: number): Promise<void> {
        const result = await this.outletRepository.getRepository().delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Outlet with ID ${id} not found.`);
        }
    }
}
