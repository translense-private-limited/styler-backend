import { Injectable } from '@nestjs/common';
import { OutletService } from './outlet.service';
import { OutletEntity } from '../entities/outlet.entity';
import { CustomerDecoratorDto } from '@src/utils/dtos/customer-decorator.dto';
import { ServiceExternalService } from '@modules/client/services/services/service-external.service';
import { ServiceSchema } from '@modules/client/services/schema/service.schema';
import { OutletRepository } from '../repositories/outlet.repository';
import { In } from 'typeorm';

@Injectable()
export class OutletExternalService {
  constructor(
    private readonly outletService: OutletService,
    private readonly serviceExternalService: ServiceExternalService,
    private readonly outletRepository:OutletRepository,
  ) {}

  async getOutletById(outletId: number): Promise<OutletEntity> {
    const outlet = await this.outletService.getOutletByIdOrThrow(outletId);
    return outlet;
  }

  async getServiceByServiceAndOutletIdOrThrow(
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

  async getOutletDetailsByIds(outletIds:number[]):Promise<OutletEntity[]>{
    console.log("inside outlet details method",outletIds)
      return this.outletRepository.getRepository().find({
        where:{id:In(outletIds)},
        relations:['address']
      })
  }
}
