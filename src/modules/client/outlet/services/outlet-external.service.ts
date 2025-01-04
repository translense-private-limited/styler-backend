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

@Injectable()
export class OutletExternalService {
  constructor(
    private readonly outletService: OutletService,
    private readonly serviceExternalService: ServiceExternalService,
    private readonly outletRepository:OutletRepository,
    private readonly outletDocsRepository:OutletDocsRepository,
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

  async updateOutletBannerImages(clientId: number, newBannerImageKey: string): Promise<void> {
    // Fetch existing banner images
    const outlet = await this.getOutletById(clientId);
  
    // Merge existing banner images with the new one
    const updatedBannerImages = [...(outlet.outletBannerImages || []), newBannerImageKey];
  
    // Update the database
    await this.outletRepository.getRepository().update(
      { id: clientId },
      { outletBannerImages: updatedBannerImages }
    );
  }
  

  async updateOutletVideos(clientId: number, newVideoKey: string): Promise<void> {
    // Fetch existing videos
    const outlet = await this.getOutletById(clientId);
  
    // Merge existing videos with the new one
    const updatedVideos = [...(outlet.videos || []), newVideoKey];
  
    // Update the database
    await this.outletRepository.getRepository().update(
      { id: clientId },
      { videos: updatedVideos }
    );
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
        { registration:key }
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
        { mou:key }
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
        { gst:key }
      );
    } else {
      // Create a new record for the given outletId with the key
      await this.outletDocsRepository.getRepository().save({
        outletId,
        gst:key,
      });
    }
  }
  
  
}
