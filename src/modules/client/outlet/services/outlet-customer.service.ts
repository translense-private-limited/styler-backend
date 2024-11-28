import { Injectable } from '@nestjs/common';

import { OutletRepository } from '../repositories/outlet.repository';
import { NearbyOutletDto } from '../dtos/nearby-outlet.dto';
import { ServiceExternal } from '@modules/client/services/services/service-external';
@Injectable()
export class OutletCustomerService {
  constructor(private outletRepository: OutletRepository,
    private readonly serviceExternal:ServiceExternal
  ) {}

  async getNearbyOutlet(nearbyOutletDto: NearbyOutletDto) {
    return this.outletRepository.getNearbyOutlet(nearbyOutletDto);
  }

  async getAllServicesForAnOutlet(outletId:number){
    return this.serviceExternal.getAllServicesForAnOutlet(outletId);
}
  async getServiceDetailsByIdInAnOutlet(outletId:number,serviceId:string){

    const services = await this.getAllServicesForAnOutlet(outletId);
    const serviceDetails = services.find((service)=>service.id === serviceId)
    return serviceDetails;
  }
}
