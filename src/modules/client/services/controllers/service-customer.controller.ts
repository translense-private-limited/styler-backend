import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ServiceCustomerService } from '../services/service-customer.service';
import { ServiceSchema } from '../schema/service.schema';

@ApiTags('Customer/Services')
@ApiBearerAuth('jwt')
@Controller('customer')
export class ServiceCustomerController {
  constructor(private serviceCustomerService: ServiceCustomerService) {}

  @Get()
  @ApiOperation({
    summary: 'Get customer details',
    description: 'Retrieve the details of the logged-in customer',
  })
  async getCustomerDetails() {
    return `Returning customer details`;
  }

  @Get('outlets/:outletId/categories')
  @ApiOperation({
    summary: 'List service categories for an outlet',
    description: 'Retrieve all service categories for the specified outlet',
  })
  async getCategoriesWithServiceCountByOutlet(
    @Param('outletId', ParseIntPipe) outletId: number,
  ) {
    return this.serviceCustomerService.getCategoriesWithServiceCountByOutlet(
      outletId,
    );
  }

  @Get('outlets/:outletId/categories/:categoryId/services')
  @ApiOperation({
    summary: 'List services for a category in an outlet',
    description:
      'Retrieve all services under a specific category for the given outlet.',
  })
  async getServicesByCategoryAndOutlet(
    @Param('outletId', ParseIntPipe) outletId: number, // Outlet identifier
    @Param('categoryId') categoryId: string, // Category identifier
  ): Promise<ServiceSchema[]> {
    return this.serviceCustomerService.getServicesByCategoryAndOutlet(
      outletId,
      categoryId,
    );
  }

  @Get('services/:serviceId')
  @ApiOperation({
    summary: 'Get service details',
    description: 'Retrieve details of a specific service by service ID',
  })
  async getServiceById(
    @Param('serviceId') serviceId: string,
  ): Promise<ServiceSchema> {
    return this.serviceCustomerService.getServiceByIdOrThrow(serviceId);
  }
}
