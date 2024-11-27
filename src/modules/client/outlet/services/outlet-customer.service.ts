import { Injectable } from '@nestjs/common';

import { OutletRepository } from '../repositories/outlet.repository';
import { NearbyOutletDto } from '../dtos/nearby-outlet.dto';
import { ServiceService } from '@modules/client/services/services/service.service';
import { OutletService } from './outlet.service';

@Injectable()
export class OutletCustomerService {
  constructor(private outletRepository: OutletRepository,
    private serviceService:ServiceService,
    private outletService:OutletService
  ) {}

  async getNearbyOutlet(nearbyOutletDto: NearbyOutletDto) {
    return this.outletRepository.getNearbyOutlet(nearbyOutletDto);
  }

  async getOutletDetails(outletId:number){
    const outlet = await this.outletService.getOutletById(outletId)
    const services = await this.serviceService.getAllServicesByOutletId(outletId)
    return {outlet,services}
  }
}
