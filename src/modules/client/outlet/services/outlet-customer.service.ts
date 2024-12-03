import { Injectable } from '@nestjs/common';

import { OutletRepository } from '../repositories/outlet.repository';
import { NearbyOutletDto } from '../dtos/nearby-outlet.dto';
import { CustomerDecoratorDto } from '@src/utils/dtos/customer-decorator.dto';
import { ServiceExternalService } from '@modules/client/services/services/service-external.service';
@Injectable()
export class OutletCustomerService {
  constructor(
    private readonly outletRepository: OutletRepository,
    private readonly serviceExternalService: ServiceExternalService,
  ) {}

  async getNearbyOutlet(nearbyOutletDto: NearbyOutletDto) {
    return this.outletRepository.getNearbyOutlet(nearbyOutletDto);
  }

  async getAllServicesForAnOutlet(outletId: number) {
    return this.serviceExternalService.getAllServicesForAnOutlet(outletId);
  }
  async getServiceByServiceAndOutletId(
    outletId: number,
    serviceId: string,
    customer: CustomerDecoratorDto,
  ) {
    return this.serviceExternalService.getServiceDetailsByServiceAndOutletIdOrThrow(
      outletId,
      serviceId,
      customer,
    );
  }
}
