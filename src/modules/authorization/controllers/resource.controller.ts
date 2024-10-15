import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ResourceService } from '../services/resource.service';
import { SuccessResponse } from '@src/utils/response/interfaces/success-response.interface';

import { ResponseHandler } from '@src/utils/response/response-handler';
import { ResourceDto } from '../dtos/resource.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResourceEntity } from '../entities/resource.entity';

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
    return (resource);
  }

  @Get('resources')
  async getAllResources(): Promise<ResourceEntity[]> {
    const resources = await this.resourceService.getAllResource()
    return resources
  }



  
}
