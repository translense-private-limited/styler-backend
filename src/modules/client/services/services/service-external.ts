import { Injectable, NotFoundException } from "@nestjs/common";
import { ServiceService } from "./service.service";
import { CustomerDecoratorDto } from "@src/utils/dtos/customer-decorator.dto";
import { ServiceRepository } from "../repositories/service.repository";

@Injectable()
export class ServiceExternal{
    constructor(private readonly serviceService:ServiceService,
        private readonly serviceRepository:ServiceRepository
    ){}

    async getAllServicesForAnOutlet(outletId:number){
        return this.serviceService.getAllServicesByOutletId(outletId);
    }

    async getServiceByServiceAndOutletId(outletId: number, serviceId: string, customer: CustomerDecoratorDto) {
        const serviceDetails = await this.serviceRepository.getRepository().findOne({
          where: { id: serviceId, outletId: outletId, whitelabelId: customer.whitelabelId,},
        });
      
        if (!serviceDetails) {
          throw new NotFoundException('Service not found for the given outlet and whitelabel');
        }
        return serviceDetails;
      }
}