import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderService } from '../services/order.service';
import { CustomerDecorator } from '@src/utils/decorators/customer.decorator';
import { CustomerDecoratorDto } from '@src/utils/dtos/customer-decorator.dto';
import { OrderResponseDto } from '../dtos/order-response.dto';
import { OrderSummaryDto } from '../dtos/order-summary.dto';

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
}

