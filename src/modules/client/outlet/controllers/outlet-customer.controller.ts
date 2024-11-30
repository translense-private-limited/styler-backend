import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OutletCustomerService } from '../services/outlet-customer.service';
import { NearbyOutletDto } from '../dtos/nearby-outlet.dto';
import { Public } from '@src/utils/decorators/public.decorator';
import { OutletService } from '../services/outlet.service';
import { CustomerDecorator } from '@src/utils/decorators/customer.decorator';
import { CustomerDecoratorDto } from '@src/utils/dtos/customer-decorator.dto';

@Controller('customer')
@ApiTags('customer/outlets')
export class OutletCustomerController {
  constructor(private outletCustomerService: OutletCustomerService,
    private outletService:OutletService
  ) {}

  @Get('outlets')
  @Public()
  @ApiOperation({
    description: 'Get nearby outlet',
    summary: 'List outlet nearest to users locations',
  })
  async getNearbyOutlet(@Query() nearbyOutletDto: NearbyOutletDto) {
    return this.outletCustomerService.getNearbyOutlet(nearbyOutletDto);
  }

  @Get('outlet/:outletId')
  @Public()
  @ApiOperation({
    description:'get outlet by Id',
    summary:'show the details of outlet by outletId'
  })
  async getOutletById(
    @Param('outletId',ParseIntPipe) outletId:number
  ){
    return this.outletService.getOutletById(outletId)
  }

  @Get('outlet/:outletId/services')
    @Public()
    async getAllServicesForAnOutlet(
        @Param('outletId',ParseIntPipe) outletId:number
    ){
        return this.outletCustomerService.getAllServicesForAnOutlet(outletId)
    }

  @Get('outlet/:outletId/service/:serviceId')
  @ApiOperation({
      description:'get service details',
      summary:'get service details by serviceId in an outlet by outletId'
  })
  async getServiceDetails(
      @Param('outletId',ParseIntPipe) outletId:number,
      @Param('serviceId') serviceId:string,
      @CustomerDecorator() customer:CustomerDecoratorDto
  ){
      return this.outletCustomerService.getServiceByServiceAndOutletId(outletId,serviceId,customer);
    }
}
