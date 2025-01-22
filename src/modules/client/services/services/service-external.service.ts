import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CustomerDecoratorDto } from '@src/utils/dtos/customer-decorator.dto';
import { ServiceSchema } from '../schema/service.schema';
import { ServiceDto } from '../dtos/service.dto';

@Injectable()
export class ServiceExternalService {
  constructor(
    private readonly serviceService: ServiceService,
  ) {}

  async getAllServicesForAnOutlet(outletId: number): Promise<ServiceSchema[]> {
    return this.serviceService.getAllServicesByOutletId(outletId);
  }

  async getServiceByIdOrThrow(serviceId: string): Promise<ServiceSchema> {
    const service = await this.serviceService.getServiceByIdOrThrow(serviceId);
    return service;
  }

  async getServiceByServiceAndOutletIdOrThrow(
    serviceId: string,
    outletId: number,
  ): Promise<ServiceSchema> {
    return this.serviceService.getServiceByServiceAndOutletIdOrThrow(
      serviceId,
      outletId,
    );
  }

  async getServiceDetailsByServiceAndOutletIdOrThrow(
    outletId: number,
    serviceId: string,
    customer: CustomerDecoratorDto,
  ): Promise<ServiceSchema> {
    const serviceDetails =
      await this.serviceService.getServiceByIdOrThrow(serviceId);
    if (
      serviceDetails &&
      serviceDetails.outletId === outletId &&
      serviceDetails.whitelabelId === customer.whitelabelId
    ) {
      return serviceDetails;
    } else {
      throw new NotFoundException(
        'Service not found for the given outlet and whitelabel',
      );
    }
  }

  async getServicesByServiceIds(
    serviceIds: string[],
  ): Promise<ServiceSchema[]> {
    return await this.serviceService.getServicesByServiceIds(serviceIds);
  }

  async updateServiceByIdOrThrow(serviceId:string,updateServiceDto:Partial<ServiceDto>):Promise<void>{
    await this.serviceService.updateServiceById(serviceId,updateServiceDto);
  }  
}
