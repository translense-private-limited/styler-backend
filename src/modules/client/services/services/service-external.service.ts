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
    return await this.serviceService.getServicesByServiceIds(serviceIds);
  }

  async updateServiceByIdOrThrow(serviceId:string,updateServiceDto:Partial<ServiceDto>):Promise<void>{
    await this.serviceService.updateServiceById(serviceId,updateServiceDto);
  }

  async getServiceImagesCountById(serviceId:string):Promise<number>{
    const service = await this.serviceService.getServiceByIdOrThrow(serviceId)
    const count = service.serviceImages.length;
    return count;
  }

  async getServiceVideosCountById(serviceId:string):Promise<number>{
    const service = await this.serviceService.getServiceByIdOrThrow(serviceId)
    const count = service.serviceVideos.length;
    return count;
  }

  async getSubtypeImagesCountById(serviceId: string): Promise<number> {
    const service = await this.serviceService.getServiceByIdOrThrow(serviceId);
  
    // Validate that subtypes exist and are an array
    if (!Array.isArray(service.subtypes)) {
      return 0; // If no subtypes, return 0
    }
  
    // Calculate the total count of images in subtypes
    const count = service.subtypes.reduce((total, subtype) => {
      if (subtype.subtypeImage) {
        return total + 1; // Increment count if the subtype has an image
      }
      return total; // Otherwise, keep the count unchanged
    }, 0);
  
    return count;
  }
  
  
}
