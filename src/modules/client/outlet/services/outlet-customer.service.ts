import { Injectable } from '@nestjs/common';

import { OutletRepository } from '../repositories/outlet.repository';
import { NearbyOutletDto } from '../dtos/nearby-outlet.dto';
import { ServiceExternal } from '@modules/client/services/services/service-external';
import { CustomerDecoratorDto } from '@src/utils/dtos/customer-decorator.dto';
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
async getServiceByServiceAndOutletId(outletId:number,serviceId:string,customer:CustomerDecoratorDto){
    return this.serviceExternal.getServiceDetailsByServiceAndOutletIdOrThrow(outletId,serviceId,customer)
}

}
