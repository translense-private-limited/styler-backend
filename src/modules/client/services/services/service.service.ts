import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ServiceRepository } from '../repositories/service.repository';
import { ServiceSchema } from '../schema/service.schema';
import { ServiceDto } from "../dtos/Service.dto";
import { CategoryRepository } from '@modules/admin/category/repository/category.repository';

@Injectable()
export class ServiceService {

  private logger = new Logger(ServiceService.name);

  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly categoryRepository: CategoryRepository  
  ) {}

  async createService(createServiceDto: ServiceDto): Promise<ServiceSchema> {
    const categoryExists = await this.categoryRepository.getRepository().findById(createServiceDto.categoryId).exec();

    if (!categoryExists) {
      throw new NotFoundException(`Category with ID ${createServiceDto.categoryId} not found.`);
    }

    return this.serviceRepository.getRepository().create(createServiceDto);
  }

  async getServices(): Promise<ServiceSchema[]> {
    return this.serviceRepository.getRepository().find();
  }

  async getServiceById(serviceId:string):Promise<ServiceSchema>{
    const service = await this.serviceRepository.getRepository().findById(serviceId);
    if(!service){
      this.logger.error('invalid service id')
      throw new NotFoundException('no service exist with provided Id')
    }
    return service;
  }

  async updateServiceById(serviceId: string, updateServiceDto: Partial<ServiceDto>): Promise<ServiceSchema> {
    const updatedService = await this.serviceRepository.getRepository().findByIdAndUpdate(
      serviceId,
      { $set: updateServiceDto },
      { new: true, omitUndefined: true }
    );

    if (!updatedService) {
      throw new NotFoundException(`Service with ID ${serviceId} not found.`);
    }

    return updatedService;
  }

  async deleteServiceById(serviceId: string): Promise<ServiceSchema[]> {
    const deletedService = await this.serviceRepository.getRepository().findByIdAndDelete(serviceId);
    
    if (!deletedService) {
      throw new NotFoundException(`Service with ID ${serviceId} not found.`);
    }

    return this.getServices();
  }

  async deleteAll(){
    await this.serviceRepository.getRepository().deleteMany({});
    return this.getServices();
  }
}
