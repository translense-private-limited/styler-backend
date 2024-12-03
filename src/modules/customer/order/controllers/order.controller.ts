import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderService } from '../services/order.service';
import { CustomerDecorator } from '@src/utils/decorators/customer.decorator';
import { CustomerDecoratorDto } from '@src/utils/dtos/customer-decorator.dto';

@ApiTags('Customer/Orders')
@Controller('customer')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('order')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @CustomerDecorator() customerDecoratorDto: CustomerDecoratorDto,
  ): Promise<CreateOrderDto> {
    return this.orderService.createOrder(createOrderDto, customerDecoratorDto);
  }
}
