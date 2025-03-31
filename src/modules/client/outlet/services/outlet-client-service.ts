import { Injectable } from '@nestjs/common';
import { OutletRepository } from '../repositories/outlet.repository';
import { CreateOutletDto } from '../dtos/outlet.dto';
import { OutletService } from './outlet.service';
import { OutletAdminService } from './outlet-admin.service';
import { OutletInterface } from '../interfaces/outlet.interface';
import { CityInterface, CountryInterface, StateInterface } from '../interfaces/address.interface';
import { DeleteOutletDto } from '../dtos/delete-outlet.dto';
import { OutletStatusEnum } from '../enums/outlet-status.enum';
import { OutletEntity } from '../entities/outlet.entity';
import { ServiceRepository } from '@modules/client/services/repositories/service.repository';


@Injectable()
export class OutletClientService {
    constructor(
        private readonly outletRepository: OutletRepository,
        private readonly outletService: OutletService,
        private readonly outletAdminService: OutletAdminService,
        private readonly serviceRepository: ServiceRepository

    ) { }

    async getOutletsByClientId(clientId: number): Promise<OutletInterface[]> {
        return await this.outletRepository.getOutletsByClientId(clientId);
    }
    async updateOutletByIdOrThrow(
        outletId: number,
        updateData: Partial<CreateOutletDto>,
    ): Promise<CreateOutletDto> {
        return this.outletAdminService.updateOutletByIdOrThrow(outletId, updateData)
    }

    async deleteOutletByIdOrThrow(
        outletId: number,
        deleteOutletDto: DeleteOutletDto,
    ): Promise<string> {

        return await this.outletAdminService.deleteOutletByIdOrThrow(outletId, deleteOutletDto);

    }

    async updateOutletStatus(
        outletId: number,
        status: OutletStatusEnum,
    ): Promise<OutletEntity> {
        return await this.outletAdminService.updateOutletStatus(outletId, status);
    }


    getAllCountries(): CountryInterface[] {
        return this.outletAdminService.getAllCountries();
    }

    getStatesByCountry(countryCode: string): StateInterface[] {
        return this.outletAdminService.getStatesByCountry(countryCode);
    }

    getCitiesByState(countryCode: string, stateCode: string): CityInterface[] {
        return this.outletAdminService.getCitiesByState(countryCode, stateCode);
    }

    async getCategorisedServices(outletId: number): Promise<Record<string, any[]>> {
        const categories = await this.serviceRepository.getCategorisedServices(outletId);

        if (!categories || categories.length === 0) {
            return {};
        }

        return categories.reduce((acc, category) => {
            acc[category.categoryName] = category.services || [];
            return acc;
        }, {});
    }

}


