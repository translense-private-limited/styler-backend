import { Injectable } from '@nestjs/common';

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
}
