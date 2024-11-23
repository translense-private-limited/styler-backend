import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { OutletCustomerService } from '../services/outlet-customer.service';
import { NearbyOutletDto } from '../dtos/nearby-outlet.dto';
import { Public } from '@src/utils/decorators/public.decorator';

@Controller('customer')
export class OutletCustomerController {
  constructor(private outletCustomerService: OutletCustomerService) {}

  @Get('outlets')
  @Public()
  @ApiOperation({
    description: 'Get nearby outlet',
  })
  async getNearbyOutlet(@Query() nearbyOutletDto: NearbyOutletDto) {
    return this.outletCustomerService.getNearbyOutlet(nearbyOutletDto);
  }
}
