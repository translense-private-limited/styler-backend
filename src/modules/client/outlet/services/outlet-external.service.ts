import { Injectable } from '@nestjs/common';
import { OutletService } from './outlet.service';
import { OutletEntity } from '../entities/outlet.entity';
import { ServiceExternal } from '@modules/client/services/services/service-external';
import { CustomerDecoratorDto } from '@src/utils/dtos/customer-decorator.dto';

@Injectable()
export class OutletExternalService {
  constructor(private outletService: OutletService,
    private serviceExternal:ServiceExternal
  ) {}

  async getOutletById(outletId: number): Promise<OutletEntity> {
    const outlet = await this.outletService.getOutletById(outletId);
    return outlet;
  }

  async getServiceByServiceAndOutletId(outletId:number,serviceId:string,customer:CustomerDecoratorDto){
    return this.serviceExternal.getServiceDetailsByServiceAndOutletIdOrThrow(outletId,serviceId,customer)
}
}
