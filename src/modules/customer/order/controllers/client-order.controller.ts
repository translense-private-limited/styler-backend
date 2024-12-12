import { Controller, Get, Query } from '@nestjs/common';
import { ClientOrderDto } from '../dtos/client-order.dto';
import { ClientOrdersService } from '../services/client-order.service';

@Controller('client')
export class ClientOrderController {
  constructor(private readonly clientOrderService: ClientOrdersService) {}

  @Get('/:clientId/open-orders')
  async getAllOpenOrders(
    @Query() query: ClientOrderDto
) {
    const { startTime, endTime } = query;
    return this.clientOrderService.getAllOpenOrders(startTime, endTime);
  }
}
