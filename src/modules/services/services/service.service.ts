// service.service.ts
import { Injectable } from '@nestjs/common';
import { ServiceRepository } from '../repositories/service.repository';
import {  ServiceSchema } from '../schema/service.schema';
import { ServiceDto } from '../dtos/service.dto';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async createService(createServiceDto: ServiceDto ): Promise<ServiceSchema> {
    return this.serviceRepository.getRepository().create(createServiceDto)
  }

  async getServices(): Promise<ServiceSchema[]> {
    return this.serviceRepository.getRepository().find()
  }

 

 
}
