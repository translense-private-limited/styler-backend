import { Body, Controller, Get, Param, Patch, Put, Query } from '@nestjs/common';
import { ClientOrderService } from '../services/client-order.service';
import { OrderResponseInterface } from '../interfaces/client-orders.interface';
import { ClientIdDecorator } from '@src/utils/decorators/client-id.decorator';
import { ClientIdDto } from '@src/utils/dtos/client-id.dto';
import { OrderFilterDto } from '../dtos/order-filter.dto';
import { OrderConfirmationDto } from '../dtos/order-confirmation.dto';
import { ApiTags } from '@nestjs/swagger';
import { TimeSlotDto } from '../dtos/time-slot.dto';
import { FulfillOrderDto } from '../dtos/order-fulfill.dto';
import { FulfillOrderResponseInterface } from '../interfaces/order-fulfill-response.interface';

@ApiTags('Client/Orders')
@Controller('client')
export class ClientOrderController {
  constructor(private readonly clientOrderService: ClientOrderService) {}

  @Get('/:clientId/open-orders')
  async getAllOpenOrders(
    @ClientIdDecorator() clientIdDto:ClientIdDto,
    @Param('clientId') clientId:number,
):Promise<OrderResponseInterface[]> {
    return this.clientOrderService.getAllOpenOrders(clientId);
  }

  @Get('/:clientId/orders')
  async getOrderHistory(
    @ClientIdDecorator() clientIdDto:ClientIdDto,
    @Query() dateRange:OrderFilterDto,
    @Param('clientId') clientId:number
  ):Promise<OrderResponseInterface[]>{
    return this.clientOrderService.getAllOrderHistoryForClient(clientId,dateRange)
  }

  @Get('/:clientId/upcoming-orders')
  async getAllUpcomingOrders(
    @ClientIdDecorator() clientIdDto:ClientIdDto,
    @Query() dateRange:OrderFilterDto,
    @Param('clientId') clientId:number,
  ):Promise<OrderResponseInterface[]>{
      return this.clientOrderService.getUpcomingOrdersForClient(clientId,dateRange)
  }

  @Put('/:clientId/order/:orderId')
  async orderConfirmation(
    @ClientIdDecorator() clientIdDto:ClientIdDto,
    @Body() orderConfirmationDto:OrderConfirmationDto,
    @Param('clientId') clientId:number,
    @Param('orderId') orderId:number,
  ):Promise<string>{
      return this.clientOrderService.confirmOrder(orderId,orderConfirmationDto,clientId,clientIdDto)
  }

  @Get('/:clientId/completed-orders')
  async getAllCompletedOrders(
    @Param('clientId') clientId:number,
    @ClientIdDecorator() clientIdDto:ClientIdDto,
    @Query() dateRange:OrderFilterDto
  ):Promise<OrderResponseInterface[]>{
    return this.clientOrderService.getAllCompletedOrdersForClient(clientId,dateRange)
  }

  @Patch('/:clientId/order/:orderId/reschedule-appointment')
  async rescheduleOrder(
    @Param('clientId') clientId:number,
    @ClientIdDecorator() clientIdDto:ClientIdDto,
    @Param('orderId') orderId:number,
    @Body() rescheduledTimeSlot:TimeSlotDto,
  ):Promise<string>{
    return await this.clientOrderService.rescheduleOrder(orderId,rescheduledTimeSlot);
  }

  @Patch('/:clientId/order/:orderId/fulfill-order')
  async fulFillTheOrder(
    @Param('clientId') clientId: number,
    @ClientIdDecorator() clientIdDto: ClientIdDto,
    @Param('orderId') orderId: number,
    @Body() fulfillOrderDto: FulfillOrderDto
  ): Promise<FulfillOrderResponseInterface> {
    return this.clientOrderService.fulFillTheOrder(clientId, orderId, fulfillOrderDto);
  }
  
}
