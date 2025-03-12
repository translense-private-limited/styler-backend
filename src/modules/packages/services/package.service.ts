import { Injectable } from '@nestjs/common';
import { PackageSchema } from '../schema/package-schema';
import { PackageRepository } from '../repositories/package.repository';
import { CreatePackageDto } from '../dtos/create-package-dto';
import { UpdatePackageDto } from '../dtos/update-package.dto';

@Injectable()
export class PackageService {
    constructor(private readonly packageRepository: PackageRepository) { }

    async createPackage(packageData: CreatePackageDto): Promise<PackageSchema> {
        return this.packageRepository.getRepository().create(packageData);
    }

    async findPackageById(id: string): Promise<PackageSchema | null> {
        return this.packageRepository.getRepository()
            .findById(id)
            .populate('services.serviceId');
    }

    async updatePackage(id: string, updateData: UpdatePackageDto): Promise<PackageSchema | null> {
        return this.packageRepository.getRepository()
            .findByIdAndUpdate(id, { $set: updateData }, { new: true, omitUndefined: true })
            .populate('services.serviceId');
    }

    async deletePackage(id: string): Promise<boolean> {
        const result = await this.packageRepository.getRepository().findByIdAndDelete(id);
        return !!result;
    }

    async findAllPackages(): Promise<PackageSchema[]> {
        return this.packageRepository.getRepository()
            .find()
            .populate('services.serviceId');
    }

    async findAllPackagesByOutletId(outletId: number): Promise<PackageSchema[]> {
        return this.packageRepository.getRepository()
            .find({ outletId })
            .populate('services.serviceId');
    }
}