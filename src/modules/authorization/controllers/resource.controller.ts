import { Body, Controller, Get, Post } from '@nestjs/common';
import { ResourceService } from '../services/resource.service';

import { ResourceDto } from '../dtos/resource.dto';

import { ResourceEntity } from '../entities/resource.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('resource')
@ApiTags('authorization')
export class ResourceController {
  constructor(private resourceService: ResourceService) {}

  @Post('resource')
  async createResource(
    @Body() createResourceDto: ResourceDto,
  ): Promise<ResourceEntity> {
    const resource =
      await this.resourceService.createResource(createResourceDto);
    return resource;
  }

  @Get('resources')
  async getAllResources(): Promise<ResourceEntity[]> {
    const resources = await this.resourceService.getAllResource();
    return resources;
  }
}
