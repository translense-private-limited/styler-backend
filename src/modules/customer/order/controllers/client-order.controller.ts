import { Controller, Get, Param, Query } from '@nestjs/common';
import { ClientOrdersService } from '../services/client-order.service';
import { OrderResponseInterface } from '../interfaces/client-orders.interface';
import { ClientIdDecorator } from '@src/utils/decorators/client-id.decorator';
import { ClientIdDto } from '@src/utils/dtos/client-id.dto';
import { OrderFilterDto } from '../dtos/order-filter.dto';

@Controller('client')
export class ClientOrderController {
  constructor(private readonly clientOrderService: ClientOrdersService) {}

  @Get('/:clientId/open-orders')
  async getAllOpenOrders(
    @ClientIdDecorator() clientIdDto:ClientIdDto,
    @Param('clientId') clientId:number,
):Promise<OrderResponseInterface[]> {
    return this.clientOrderService.getAllOpenOrders(clientId);
  }

  // @Get('/:clientId/orders')
  // async getOrderHistory(
  //   @ClientIdDecorator() clientIdDto:ClientIdDto,
  //   @Query() query:OrderFilterDto,
  //   @Param('clientId') clientId:number
  // ):Promise<OrderResponseInterface[]>{
  //   const {startTime,endTime} = query;
  //   return this.clientOrderService.getAllOrderHistory(startTime,endTime,clientId)
  // }

  @Get('/:clientId/upcoming-orders')
  async getAllUpcomingOrders(
    @ClientIdDecorator() clientIdDto:ClientIdDto,
    @Query() query:OrderFilterDto,
    @Param('clientId') clientId:number,
  ):Promise<OrderResponseInterface[]>{
      const {startTime,endTime} = query;
      return this.clientOrderService.getUpcomingOrders(startTime,endTime,clientId)
  }
}
