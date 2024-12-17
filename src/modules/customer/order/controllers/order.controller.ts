import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderService } from '../services/order.service';
import { CustomerDecorator } from '@src/utils/decorators/customer.decorator';
import { CustomerDecoratorDto } from '@src/utils/dtos/customer-decorator.dto';
import { OrderResponseDto } from '../dtos/order-response.dto';
import { OrderSummaryDto } from '../dtos/order-summary.dto';
import { CustomerOrderResponseInterface } from '../interfaces/customer-order-response.interface';

@ApiTags('Customer/Orders')
@Controller('customer')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('order')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @CustomerDecorator() customerDecoratorDto: CustomerDecoratorDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.createOrder(createOrderDto, customerDecoratorDto);
  }

  @Get('order/:orderId')
  async getOrderSummaryByOrderId(
    @Param('orderId') orderId:number,
    @CustomerDecorator() customerDecoratorDto:CustomerDecoratorDto
  ):Promise<OrderSummaryDto>{
    return this.orderService.getOrderSummaryByOrderIdOrThrow(orderId,customerDecoratorDto.customerId)
  }

  @Get('order/:customerId/upcoming-orders')
    async getUpcomingOrdersForCustomer(
        @Param('customerId') customerId:number,
    ):Promise<CustomerOrderResponseInterface[]>{
        console.log(customerId);
        return this.orderService.getUpcomingOrdersForCustomer(customerId);
    }

  @Get('order/:customerId/orders')
  async getOrderHistoryForCustomer(
    @Param('customerId') customerId:number
  ):Promise<CustomerOrderResponseInterface[]>{
      return this.orderService.getOrderHistoryForCustomer(customerId)
  }

  @Get('order/:customerId/completed-orders')
  async getCompletedOrders(
    @Param('customerId') customerId:number
  ):Promise<CustomerOrderResponseInterface[]>{
      return this.orderService.getCompletedOrdersForCustomer(customerId)
  }
}

