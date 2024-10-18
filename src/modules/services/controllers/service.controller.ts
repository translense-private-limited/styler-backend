// service.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ServiceService } from '../services/service.service';

import { Public } from '@src/utils/decorators/public.decorator';
import { ServiceDto } from '../dtos/service.dto';
import { ServiceSchema } from '../schema/service.schema';
import { ApiTags } from '@nestjs/swagger';

@Public()
@Controller('services')
@ApiTags('services')
@Public()
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  async createService(@Body() createServiceDto: ServiceDto ): Promise<ServiceSchema> {
    return this.serviceService.createService(createServiceDto);
  }

  @Get()
  async getServices(): Promise<ServiceSchema[]> {
    return this.serviceService.getServices();
  }

  
}
