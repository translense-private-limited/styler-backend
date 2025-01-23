import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ServiceRepository } from '../repositories/service.repository';
import { ServiceSchema } from '../schema/service.schema';
import { ServiceDto } from '../dtos/service.dto';
import { CategoryExternal } from '@modules/admin/category/services/category-external';
import { badRequest, throwIfNotFound } from '@src/utils/exceptions/common.exception';
import { SubtypeDto } from '../dtos/subtype.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ServiceService {
  private logger = new Logger(ServiceService.name);

  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly categoryExternal: CategoryExternal,
  ) {}

  async createService(createServiceDto: ServiceDto): Promise<ServiceSchema> {
    await this.categoryExternal.getCategoryById(createServiceDto.categoryId);

    // Generate unique IDs for each subtype if they exist
    if (createServiceDto.subtypes) {
      this.assignIdsToSubtypes(createServiceDto.subtypes);
    }

    return this.serviceRepository.getRepository().create(createServiceDto);
  }

  async getServices(): Promise<ServiceSchema[]> {
    return this.serviceRepository.getRepository().find();
  }

  async getAllServicesByOutletId(outletId: number): Promise<ServiceSchema[]> {
    return this.serviceRepository.getRepository().find({ outletId });
  }

  async getServiceByIdOrThrow(serviceId: string): Promise<ServiceSchema> {
    const service = await this.serviceRepository
      .getRepository()
      .findById(serviceId);
    throwIfNotFound(service,'no service exist with provided Id')
    return service;
  }

  async getServiceByServiceAndOutletIdOrThrow(
    serviceId: string,
    outletId: number,
  ): Promise<ServiceSchema> {
    const service = await this.serviceRepository.getRepository().findOne({
      outletId: outletId,
      _id: serviceId,
    });
    if (!service) {
      throw new NotFoundException('no service exist with provided Id');
    }
    return service;
  }

  async updateServiceById(
    serviceId: string,
    updateServiceDto: Partial<ServiceDto>,
  ): Promise<ServiceSchema> {    
    const updatedService = await this.serviceRepository
      .getRepository()
      .findByIdAndUpdate(
        serviceId,
        { $set: updateServiceDto },
        { new: true, omitUndefined: true },
      );
    return updatedService;
  }

  async deleteServiceById(serviceId: string): Promise<ServiceSchema[]> {
    const deletedService = await this.serviceRepository
      .getRepository()
      .findByIdAndDelete(serviceId);

    if (!deletedService) {
      throw new NotFoundException(`Service with ID ${serviceId} not found.`);
    }

    return this.getServices();
  }

  async deleteAll(): Promise<ServiceSchema[]> {
    await this.serviceRepository.getRepository().deleteMany({});
    return this.getServices();
  }

  async getServicesByServiceIds(
    serviceIds: string[],
  ): Promise<ServiceSchema[]> {
    const services = await this.serviceRepository
      .getRepository()
      .find({ _id: { $in: serviceIds } })
      .lean();
    return services;
  }

  async addSubtypeToExistingService(
    serviceId: string, 
    subtype: SubtypeDto
  ): Promise<ServiceSchema> {
    const service = await this.getServiceByIdOrThrow(serviceId);
  
    // Generate a unique ID for the new subtype
    const newSubtype = {
      id: uuidv4(),
      ...subtype,
    };
    // Add the new subtype to the subtypes array
    service.subtypes.push(newSubtype);
    return service.save();
  }

  async updateSubtype(
    serviceId: string,
    subtypeId: string,
    updatedSubtype: Partial<SubtypeDto>
  ): Promise<ServiceSchema> {
    const service = await this.getServiceByIdOrThrow(serviceId);
  
    // Find the subtype by its unique subtypeId
    const subtype = service.subtypes.find(subtype => subtype.id === subtypeId);
    if (!subtype) {
      throw new Error(`Subtype with ID ${subtypeId} not found in service ${serviceId}`);
    }
  
    Object.assign(subtype, updatedSubtype);
    service.markModified('subtypes');
    return service.save();
  }
  
  async deleteSubtype(serviceId: string, subtypeId: string): Promise<void> {
    try {
      // Remove the specific subtype from the service's subtypes array
      const result = await this.serviceRepository.getRepository().updateOne(
        { _id: serviceId, "subtypes.id": subtypeId },
        { $pull: { subtypes: { id: subtypeId } } }   // Remove the subtype by id
      );
  
      // Check if the operation was successful
      if (result.modifiedCount === 0) {
        throw new Error(
          `Subtype with ID ${subtypeId} not found in service with ID ${serviceId}`
        );
      }
    } catch (error) {
      // Log and throw the error for further handling
      throw new Error(`Failed to delete subtype: ${error.message}`);
    }
  }
  // Delete from serviceImages
  async deleteServiceImageKey(key: string): Promise<void> {
    const result = await this.serviceRepository.getRepository().updateOne(
      { serviceImages: { $in: [key] } }, 
      { $pull: { serviceImages: key } }
    );
    
    if (result.modifiedCount === 0) {
      badRequest('Service image not found');
    }
  }

  // Delete from serviceVideos
  async deleteServiceVideoKey(key: string): Promise<void> {
    const result = await this.serviceRepository.getRepository().updateOne(
      { serviceVideos: { $in: [key] } }, // Find a document where the array contains the key
      { $pull: { serviceVideos: key } } // Remove the key from the array
    );
    
    if (result.modifiedCount === 0) {
      badRequest('Service video not found');
    }
  }

  
  // Delete from subtypes (subtypeImages)
  async deleteServiceSubtypeImageKey(key: string): Promise<void> {
    const result = await this.serviceRepository.getRepository().updateOne(
      { 'subtypes.subtypeImages': key }, // Find documents where a subtype's subtypeImages array contains the key
      { $pull: { 'subtypes.$[].subtypeImages': key } } // Remove the key from all subtypeImages arrays
    );

    if (result.modifiedCount === 0) {
      badRequest('Service subtype image not found');
    }
  }

  
  private assignIdsToSubtypes(subtypes?: SubtypeDto[]): void {
  if (subtypes) {
    subtypes.forEach(subtype => {
      subtype['id'] = uuidv4();  // Assign a unique ID to the subtype
    });
  }
  }

}
