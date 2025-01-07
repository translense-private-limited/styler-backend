import { Injectable } from '@nestjs/common';
import { OutletService } from './outlet.service';
import { OutletEntity } from '../entities/outlet.entity';
import { CustomerDecoratorDto } from '@src/utils/dtos/customer-decorator.dto';
import { ServiceExternalService } from '@modules/client/services/services/service-external.service';
import { ServiceSchema } from '@modules/client/services/schema/service.schema';
import { OutletAdminService } from './outlet-admin.service';
import { CreateOutletDto } from '../dtos/outlet.dto';
import { OutletDocsService } from './outlet-docs-service';

@Injectable()
export class OutletExternalService {
  constructor(
    private readonly outletService: OutletService,
    private readonly serviceExternalService: ServiceExternalService,
    private readonly outletAdminService:OutletAdminService,
    private readonly outletDocsService:OutletDocsService
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
      return this.outletService.getOutletDetailsByIds(outletIds);
  }

  async updateOutletByIdOrThrow(outletId:number,updatedData:Partial<CreateOutletDto>):Promise<void>{
    await this.outletAdminService.updateOutletByIdOrThrow(outletId,updatedData)
  }


  async saveOutletRegistration(outletId: number, key: string): Promise<void> {
    await this.outletDocsService.saveOutletRegistration(outletId,key);
  }

    async saveOutletMou(outletId: number, key: string): Promise<void> {
      await this.outletDocsService.saveOutletMou(outletId,key);
  }

    async saveOutletGst(outletId: number, key: string): Promise<void> {
      await this.outletDocsService.saveOutletGst(outletId,key);
  }
  async getOutletBannerImagesCountById(outletId:number):Promise<number>{
    const outlet = await this.outletService.getOutletByIdOrThrow(outletId)
    const count = outlet.outletBannerImages.length;
    return count;
  }

  async getOutletVideosCountById(outletId:number):Promise<number>{
    const outlet = await this.outletService.getOutletByIdOrThrow(outletId)
    const count = outlet.outletVideos.length;
    return count;
  }
  
}
