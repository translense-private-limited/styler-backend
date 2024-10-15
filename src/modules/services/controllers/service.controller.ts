// service.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ServiceService } from '../services/service.service';
import { Service } from '../schema/service.schema';
import { Public } from '@src/utils/decorators/public.decorator';
import { ServiceDto } from '../dtos/service.dto';

@Controller('services')
@Public()
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  async createService(@Body() createServiceDto: ServiceDto ): Promise<Service> {
    return this.serviceService.createService(createServiceDto);
  }

  @Get()
  async getServices(): Promise<Service[]> {
    return this.serviceService.getServices();
  }

  
}
