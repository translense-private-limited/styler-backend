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

  async getSubtypeImagesCountById(serviceId: string, subtypeId: string): Promise<number> {
    const service = await this.serviceService.getServiceByIdOrThrow(serviceId);
  
    // Find the specific subtype by subtypeId
    const subtype = service.subtypes.find(sub => sub.id === subtypeId);
    
    // If subtype is not found or subtypeImages is not an array, return 0
    if (!subtype || !Array.isArray(subtype.subtypeImages)) {
      return 0;
    }
  
    // Return the count of images in that subtype
    return subtype.subtypeImages.length;
  }
  
  
  async updateServiceImageKeysById(serviceId:string,updateServiceDto:Partial<ServiceDto>):Promise<ServiceSchema>{
    return await this.serviceService.updateServiceById(serviceId,updateServiceDto);
  }
  
  async getAllServiceImageKeysForAnOutlet(outletId:number):Promise<Partial<ServiceSchema>[]>{
    return await this.serviceService.getAllServiceImageKeysForAnOutlet(outletId)
  }
}
