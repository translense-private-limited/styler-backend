import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { OutletCustomerService } from '../services/outlet-customer.service';
import { NearbyOutletDto } from '../dtos/nearby-outlet.dto';

@Controller('customer')
export class OutletCustomerController {
  constructor(private outletCustomerService: OutletCustomerService) {}

  @Get('outlets')
  @ApiOperation({
    description: 'Get nearby outlet',
  })
  async getNearbyOutlet(@Query() nearbyOutletDto: NearbyOutletDto) {
    return this.outletCustomerService.getNearbyOutlet(nearbyOutletDto);
  }
}
