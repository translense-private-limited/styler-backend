import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { ClientOrderDto } from '../dtos/client-order.dto';
import { ClientOrdersService } from '../services/client-order.service';
import { OpenOrderDetailsInterface } from '../interfaces/open-orders-details.interface';
import { ClientIdDecorator } from '@src/utils/decorators/client-id.decorator';
import { ClientIdDto } from '@src/utils/dtos/client-id.dto';

@Controller('client')
export class ClientOrderController {
  constructor(private readonly clientOrderService: ClientOrdersService) {}

  @Get('/:clientId/open-orders')
  async getAllOpenOrders(
    @Query() query: ClientOrderDto,
    @Param('clientId') clientId:number,
    @ClientIdDecorator() clientIdDto:ClientIdDto
):Promise<OpenOrderDetailsInterface[]> {
    const { startTime, endTime } = query;
    // Check if startTime is in the future
    const currentTime = new Date();
    if (new Date(startTime) > currentTime) {
        throw new BadRequestException('Start time cannot be in the future');
    }
    return this.clientOrderService.getAllOpenOrders(startTime, endTime,clientId);
  }
}
