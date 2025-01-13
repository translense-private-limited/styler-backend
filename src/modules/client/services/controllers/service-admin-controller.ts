import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ServiceSchema } from "../schema/service.schema";
import { ServiceDto } from "../dtos/service.dto";
import { ServiceService } from "../services/service.service";
import { SubtypeDto } from "../dtos/subtype.dto";

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

    @Post('service/:serviceId/subtype')
    async addSubtypeToExistingService(
      @Param('serviceId') serviceId: string,
      @Body() subtype: SubtypeDto
    ): Promise<ServiceSchema> {
      return this.serviceService.addSubtypeToExistingService(serviceId, subtype);
    }

    @Patch('service/:serviceId/subtype/:subtypeId')
    async updateSubtype(
      @Param('serviceId') serviceId: string,
      @Param('subtypeId') subtypeId: string,
      @Body() updatedSubtype: Partial<SubtypeDto>
    ): Promise<ServiceSchema> {
      return this.serviceService.updateSubtype(serviceId, subtypeId, updatedSubtype);
    }

    @Delete('service/:serviceId/subtype/:subtypeId')
    async deleteSubtype(
      @Param('serviceId') serviceId: string,
      @Param('subtypeId') subtypeId: string
    ): Promise<void> {
      return this.serviceService.deleteSubtype(serviceId, subtypeId);
    }
}