import {  Injectable } from '@nestjs/common';
import { ResourceRepository } from '../repositories/resource.repository';

import { ResourceDto } from '../dtos/resource.dto';
import { ResourceEntity } from '../entities/resource.entity';


@Injectable()
export class ResourceService {
  constructor(private resourceRepository: ResourceRepository) {}

  async createResource(
    createResourceDto: ResourceDto,
  ): Promise<ResourceEntity> {
    const resource = await this.resourceRepository
      .getRepository()
      .save(createResourceDto);
    return resource;
  }

  async getAllResource(): Promise<ResourceEntity[]> {
    return await this.resourceRepository.getRepository().find();
  }


}
