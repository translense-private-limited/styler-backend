import { Controller, Get, Param } from '@nestjs/common';
import { ClientOrdersService } from '../services/client-order.service';
import { OrderResponseInterface } from '../interfaces/client-orders.interface';
import { ClientIdDecorator } from '@src/utils/decorators/client-id.decorator';
import { ClientIdDto } from '@src/utils/dtos/client-id.dto';

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
  //   @Query() query:ClientOrderDto,
  //   @Param('clientId') clientId:number
  // ):Promise<OpenOrderResponseInterface[]>{
  //   const {startTime,endTime} = query;
  //   return this.clientOrderService.getAllOrderHistory(startTime,endTime,clientId)
  // }

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
