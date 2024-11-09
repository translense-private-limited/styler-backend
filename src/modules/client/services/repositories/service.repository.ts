import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseSchema } from '@src/utils/repositories/base-schema';
import { getMongodbDataSource } from '@modules/database/data-source';
import { ServiceSchema } from '../schema/service.schema';

@Injectable()
export class ServiceRepository extends BaseSchema<ServiceSchema> {
  private readonly serviceRepository: Model<ServiceSchema>;

  constructor(
    @InjectModel(ServiceSchema.name, getMongodbDataSource())
    serviceModel: Model<ServiceSchema>, // Change parameter name to serviceModel
  ) {
    super(serviceModel); // Pass the model to the base class
    this.serviceRepository = serviceModel; // Assign to the instance variable
  }

  //   async create(serviceData: Partial<Service>): Promise<Service> {
  //     const newService = new this.serviceRepository(serviceData); // Use this.serviceRepository directly
  //     return newService.save();
  //   }

  //   async findAll(): Promise<Service[]> {
  //     return this.serviceRepository.find().exec(); // Use this.serviceRepository directly
  //   }

  //   async findById(id: string): Promise<Service | null> {
  //     return this.serviceRepository.findById(id).exec(); // Use this.serviceRepository directly
  //   }

  //   async update(id: string, serviceData: Partial<Service>): Promise<Service | null> {
  //     return this.serviceRepository.findByIdAndUpdate(id, serviceData, { new: true }).exec(); // Use this.serviceRepository directly
  //   }

  //   getRepository() {
  //     return this.serviceRepository; // Expose this.serviceRepository for external access
  //   }
}
