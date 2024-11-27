import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OutletCustomerService } from '../services/outlet-customer.service';
import { NearbyOutletDto } from '../dtos/nearby-outlet.dto';
import { Public } from '@src/utils/decorators/public.decorator';
import { OutletService } from '../services/outlet.service';

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

  @Get('outletDetails/:outletId')
  @Public()
  @ApiOperation({
    description:'get outlet by Id',
    summary:'show the details of outlet by outletId'
  })
  async getOutletDetailsById(
    @Param('outletId',ParseIntPipe) outletId:number
  ){
    return this.outletCustomerService.getOutletDetails(outletId)
  }
}
