import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { ClientOrderDto } from '../dtos/client-order.dto';
import { ClientOrdersService } from '../services/client-order.service';
import { OpenOrderResponseInterface } from '../interfaces/open-orders.interface';
import { ClientIdDecorator } from '@src/utils/decorators/client-id.decorator';
import { ClientIdDto } from '@src/utils/dtos/client-id.dto';
import { OrderHistoryResponseInterface } from '../interfaces/order-history-response.interface';

@Controller('client')
export class ClientOrderController {
  constructor(private readonly clientOrderService: ClientOrdersService) {}

  @Get('/:clientId/open-orders')
  async getAllOpenOrders(
    @ClientIdDecorator() clientIdDto:ClientIdDto,
    @Query() query: ClientOrderDto,
    @Param('clientId') clientId:number,
):Promise<OpenOrderResponseInterface[]> {
    const { startTime, endTime } = query;
    // Check if startTime is in the future
    const currentTime = new Date();
    if (new Date(startTime) > currentTime) {
        throw new BadRequestException('Start time cannot be in the future');
    }
    return this.clientOrderService.getAllOpenOrders(startTime, endTime,clientId);
  }

  @Get('/:clientId/orders')
  async getOrderHistory(
    @ClientIdDecorator() clientIdDto:ClientIdDto,
    @Query() query:ClientOrderDto,
    @Param('clientId') clientId:number
  ):Promise<OrderHistoryResponseInterface[]>{
    const {startTime,endTime} = query;
    return this.clientOrderService.getAllOrderHistory(startTime,endTime,clientId)
  }

  // @Get('/:clientId/upcoming-orders')
  // async getAllUpcomingOrders(
  //   @ClientIdDecorator() clientIdDto:ClientIdDto,
  //   @Query() query:ClientOrderDto,
  //   @Param('clientId') clientId:number,
  // ){
  //     const {startTime,endTime} = query;
  //     if(new Date(startTime)>new Date(endTime)){
  //       return { status: 400, message: 'Start date cannot be after end date' };
  //     }
  //     return this.clientOrderService.getUpcomingOrders(startTime,endTime,clientId)
  // }
}
