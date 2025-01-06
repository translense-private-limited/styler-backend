import { Injectable } from '@nestjs/common';
import { OutletService } from './outlet.service';
import { OutletEntity } from '../entities/outlet.entity';
import { CustomerDecoratorDto } from '@src/utils/dtos/customer-decorator.dto';
import { ServiceExternalService } from '@modules/client/services/services/service-external.service';
import { ServiceSchema } from '@modules/client/services/schema/service.schema';
import { OutletRepository } from '../repositories/outlet.repository';
import { In } from 'typeorm';
import { OutletDocsRepository } from '../repositories/outlet-docs.repository';
import { OutletDocsEntity } from '../entities/outlet-docs.entity';
import { OutletAdminService } from './outlet-admin.service';
import { CreateOutletDto } from '../dtos/outlet.dto';

@Injectable()
export class OutletExternalService {
  constructor(
    private readonly outletService: OutletService,
    private readonly serviceExternalService: ServiceExternalService,
    private readonly outletRepository:OutletRepository,
    private readonly outletDocsRepository:OutletDocsRepository,
    private readonly outletAdminService:OutletAdminService
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
      return this.outletRepository.getRepository().find({
        where:{id:In(outletIds)},
        relations:['address']
      })
  }

  async updateOutletByIdOrThrow(outletId:number,updatedData:Partial<CreateOutletDto>):Promise<void>{
    await this.outletAdminService.updateOutletByIdOrThrow(outletId,updatedData)
  }

  async getOutletDocsById(outletId:number):Promise<OutletDocsEntity>{
    return await this.outletDocsRepository.getRepository().findOne({ where: { outletId } });
  }

  async saveOutletRegistration(outletId: number, key: string): Promise<void> {
    // Check if a record exists for the given outletId
    const existingRecord = await this.getOutletDocsById(outletId)
  
    if (existingRecord) {
      // Update the existing record with the new key
      await this.outletDocsRepository.getRepository().update(
        { outletId },
        { registrationKey:key }
      );
    } else {
      // Create a new record for the given outletId with the key
      await this.outletDocsRepository.getRepository().save({
        outletId,
        registration:key,
      });
    }
  }

    async saveOutletMou(outletId: number, key: string): Promise<void> {
    // Check if a record exists for the given outletId
    const existingRecord = await this.getOutletDocsById(outletId)
  
    if (existingRecord) {
      // Update the existing record with the new key
      await this.outletDocsRepository.getRepository().update(
        { outletId },
        { mouKey:key }
      );
    } else {
      // Create a new record for the given outletId with the key
      await this.outletDocsRepository.getRepository().save({
        outletId,
        mou:key,
      });
    }
  }

    async saveOutletGst(outletId: number, key: string): Promise<void> {
    // Check if a record exists for the given outletId
    const existingRecord = await this.getOutletDocsById(outletId)
  
    if (existingRecord) {
      // Update the existing record with the new key
      await this.outletDocsRepository.getRepository().update(
        { outletId },
        { gstKey:key }
      );
    } else {
      // Create a new record for the given outletId with the key
      await this.outletDocsRepository.getRepository().save({
        outletId,
        gst:key,
      });
    }
  }
  async getOutletBannerIMagesCountById(outletId:number):Promise<number>{
    const outlet = await this.outletService.getOutletByIdOrThrow(outletId)
    const count = outlet.outletBannerImages.length ==0?1:outlet.outletBannerImages.length+1;
    return count;
  }

  async getOutletVideosCountById(outletId:number):Promise<number>{
    const outlet = await this.outletService.getOutletByIdOrThrow(outletId)
    const count = outlet.outletVideos.length ==0?1:outlet.outletVideos.length+1;
    return count;
  }
  
}
