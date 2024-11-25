import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceRepository } from '../repositories/service.repository';
import { CategoryWithServiceCountDto } from '../dtos/category-with-service-count.dto';
import { ServiceSchema } from '../schema/service.schema';

@Injectable()
export class ServiceCustomerService {
  constructor(private serviceRepository: ServiceRepository) {}

  async getServiceByIdOrThrow(serviceId: string): Promise<ServiceSchema> {
    const service = await this.serviceRepository
      .getRepository()
      .findOne({ _id: serviceId });
    if (!service) {
      throw new NotFoundException(`No details found`);
    }
    return service;
  }

  async getCategoriesWithServiceCountByOutlet(
    outletId: number,
  ): Promise<CategoryWithServiceCountDto[]> {
    return this.serviceRepository.getCategoriesWithServiceCountByOutlet(
      outletId,
    );
  }

  async getServicesByCategoryAndOutlet(
    outletId: number,
    categoryId: string,
  ): Promise<ServiceSchema[]> {
    return this.serviceRepository.getRepository().find({
      categoryId,
      outletId,
    });
  }
}
