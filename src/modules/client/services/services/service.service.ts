import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ServiceRepository } from '../repositories/service.repository';
import { ServiceSchema } from '../schema/service.schema';
import { ServiceDto } from '../dtos/service.dto';
import { CategoryExternal } from '@modules/admin/category/services/category-external';
import { throwIfNotFound } from '@src/utils/exceptions/common.exception';
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
    return service.save();
  }
  
  async deleteSubtype(
    serviceId: string,
     subtypeId: string
    ): Promise<ServiceSchema> {
    const service = await this.getServiceByIdOrThrow(serviceId);
  
    // Filter out the subtype with the given subtypeId
    const subtypeExists = service.subtypes.some(subtype => subtype.id === subtypeId);
    throwIfNotFound(subtypeExists,`Subtype with ID ${subtypeId} not found in service ${serviceId}`)
  
    service.subtypes = service.subtypes.filter(subtype => subtype.id !== subtypeId);
  
    // Save the updated service
    return service.save();
  }
  
  private assignIdsToSubtypes(subtypes?: SubtypeDto[]): void {
  if (subtypes) {
    subtypes.forEach(subtype => {
      subtype['id'] = uuidv4();  // Assign a unique ID to the subtype
    });
  }
  }

}
