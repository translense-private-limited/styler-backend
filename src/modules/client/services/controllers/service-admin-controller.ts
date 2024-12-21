import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ServiceSchema } from "../schema/service.schema";
import { ServiceDto } from "../dtos/service.dto";
import { ServiceService } from "../services/service.service";

@Controller('admin')
export class ServiceAdminController{
    constructor(
        private readonly serviceService:ServiceService
    ){}

    @Post('/service')
    async createService(
        @Body() createServiceDto:ServiceDto
    ):Promise<ServiceSchema>{
        return this.serviceService.createService(createServiceDto);
    }
    @Get('/outlet/:outletId/services')
    async getAllServicesForOutlet(
        @Param('outletId',ParseIntPipe) outletId:number
    ):Promise<ServiceSchema[]>{
        return this.serviceService.getAllServicesByOutletId(outletId)
    }

    @Get('services/:serviceId')
    async getServiceDetails(
        @Param('serviceId') serviceId:string
    ):Promise<ServiceSchema>{
        return this.serviceService.getServiceByIdOrThrow(serviceId)
    }

    @Patch('services/:serviceId')
    async updateService(
      @Param('serviceId') serviceId: string,
      @Body() UpdateServiceDto: Partial<ServiceDto>,
    ): Promise<ServiceSchema> {
      return this.serviceService.updateServiceById(serviceId, UpdateServiceDto);
    }

}