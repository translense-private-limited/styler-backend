// service.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ServiceService } from '../services/service.service';
import { ServiceDto } from '../dtos/service.dto';
import { ServiceSchema } from '../schema/service.schema';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('client')
@ApiBearerAuth('jwt')
@ApiTags('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post('service')
  async createService(
    @Body() createServiceDto: ServiceDto,
  ): Promise<ServiceSchema> {
    return this.serviceService.createService(createServiceDto);
  }

  @Get('services/outlet/:outletId')
  async getServices(
    @Param('outletId', ParseIntPipe) outletId: number,
  ): Promise<ServiceSchema[]> {
    return this.serviceService.getAllServicesByOutletId(outletId);
  }

  @Get('service/:id')
  async getServiceById(@Param('id') serviceId: string): Promise<ServiceSchema> {
    return this.serviceService.getServiceByIdOrThrow(serviceId);
  }

  @Patch('service/:id')
  async updateService(
    @Param('id') serviceId: string,
    @Body() UpdateServiceDto: Partial<ServiceDto>,
  ): Promise<ServiceSchema> {
    return this.serviceService.updateServiceById(serviceId, UpdateServiceDto);
  }

  @Delete('service/:id')
  async deleteService(
    @Param('id') serviceId: string,
  ): Promise<ServiceSchema[]> {
    return this.serviceService.deleteServiceById(serviceId);
  }

  @Delete('services')
  async deleteServices(): Promise<ServiceSchema[]> {
    return this.serviceService.deleteAll();
  }
}
