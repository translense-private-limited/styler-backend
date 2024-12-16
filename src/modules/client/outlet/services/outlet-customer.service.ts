import { Injectable } from '@nestjs/common';

import { OutletRepository } from '../repositories/outlet.repository';
import { NearbyOutletDto } from '../dtos/nearby-outlet.dto';
import { CustomerDecoratorDto } from '@src/utils/dtos/customer-decorator.dto';
import { ServiceExternalService } from '@modules/client/services/services/service-external.service';
import { OutletEntity } from '../entities/outlet.entity';
import { ServiceSchema } from '@modules/client/services/schema/service.schema';
@Injectable()
export class OutletCustomerService {
  constructor(
    private readonly outletRepository: OutletRepository,
    private readonly serviceExternalService: ServiceExternalService,
  ) {}

  async getNearbyOutlet(
    nearbyOutletDto: NearbyOutletDto,
  ): Promise<OutletEntity[]> {
    return this.outletRepository.getNearbyOutlet(nearbyOutletDto);
  }

  async getAllServicesForAnOutlet(outletId: number): Promise<ServiceSchema[]> {
    return this.serviceExternalService.getAllServicesForAnOutlet(outletId);
  }
  async getServiceByServiceAndOutletId(
    outletId: number,
    serviceId: string,
    customer: CustomerDecoratorDto,
  ): Promise<ServiceSchema> {
    return this.serviceExternalService.getServiceDetailsByServiceAndOutletIdOrThrow(
      outletId,
      serviceId,
      customer,
    );
  }
}
