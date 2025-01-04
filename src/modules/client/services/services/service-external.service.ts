import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CustomerDecoratorDto } from '@src/utils/dtos/customer-decorator.dto';
import { ServiceRepository } from '../repositories/service.repository';
import { ServiceSchema } from '../schema/service.schema';

@Injectable()
export class ServiceExternalService {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async getAllServicesForAnOutlet(outletId: number): Promise<ServiceSchema[]> {
    return this.serviceService.getAllServicesByOutletId(outletId);
  }

  async getServiceByIdOrThrow(serviceId: string): Promise<ServiceSchema> {
    const service = await this.serviceRepository
      .getRepository()
      .findById(serviceId);
    if (!service) {
      throw new NotFoundException('no service exist with provided Id');
    }
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
  // async getServiceDetailsByServiceAndOutletIdOrThrow(outletId: number, serviceId: string, customer: CustomerDecoratorDto) {
  //   console.log(serviceId,outletId,customer)
  //   const serviceDetails = await this.serviceRepository.getRepository().findOne({
  //       where: {
  //           serviceId,
  //           outletId,
  //           whitelabelId: customer.whitelabelId
  //       }
  //   });

  //   if (!serviceDetails) {
  //       throw new NotFoundException('Service not found for the given outlet and whitelabel');
  //   }

  //   return serviceDetails;
  // }

  async getServicesByServiceIds(
    serviceIds: string[],
  ): Promise<ServiceSchema[]> {
    const services = await this.serviceRepository
      .getRepository()
      .find({ _id: { $in: serviceIds } })
      .lean();
    return services;
  }

  async updateServiceImages(serviceId: string, newImages: string): Promise<void> {
    // Fetch existing images
    const service = await this.getServiceByIdOrThrow(serviceId)
  
    // Merge existing images with new ones
    const updatedImages = [...(service.serviceImages || []), ...newImages];
  
    await this.serviceRepository.getRepository().updateOne(
      { serviceId },
      { serviceImages: updatedImages }
    );
  }
  
  async updateServiceVideos(serviceId: string, newVideos: string): Promise<void> {
    // Fetch existing videos
    const service = await this.getServiceByIdOrThrow(serviceId);
  
    // Merge existing videos with new ones
    const updatedVideos = [...(service.serviceVideos || []), ...newVideos];
  
    // Update the database
    await this.serviceRepository.getRepository().updateOne(
      { serviceId },
      { serviceVideos: updatedVideos }
    );
  }
  
}
