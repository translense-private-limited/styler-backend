import { Injectable } from '@nestjs/common';
import { PackageSchema } from '../schema/package-schema';
import { PackageRepository } from '../repositories/package.repository';
import { CreatePackageDto } from '../dtos/create-package-dto';
import { UpdatePackageDto } from '../dtos/update-package.dto';
import { PackageService } from './package.service';

@Injectable()
export class PackageClientService {
    constructor(
        private readonly packageRepository: PackageRepository,
        private readonly packageService: PackageService
    ) { }

    async createPackageByClient(packageData: CreatePackageDto): Promise<PackageSchema> {
        return this.packageService.createPackage(packageData);
    }

    async findPackageById(id: string): Promise<PackageSchema | null> {
        return this.packageService.findPackageById(id);
    }

    async updatePackage(id: string, updatedData: UpdatePackageDto): Promise<PackageSchema | null> {
        return this.packageService.updatePackage(id, updatedData);
    }

    async deletePackage(id: string): Promise<boolean> {
        return this.packageService.deletePackage(id);;
    }

    async findAllPackagesByOutletId(outletId: number): Promise<PackageSchema[]> {
        return this.packageService.findAllPackagesByOutletId(outletId);
    }

}