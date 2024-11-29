import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CustomerDecorator } from "@src/utils/decorators/customer.decorator";
import { CustomerDecoratorDto } from "@src/utils/dtos/customer-decorator.dto";
import { CreateOrderDto } from "../dtos/create-order.dto";
import { OrderService } from "../services/order.service";

@ApiTags('customer/orders')
@Controller('customer')
export class OrderController{
    constructor(private readonly orderService:OrderService){}

    @Post('order')
    async createOrder(
        @Body() createOrderDto:CreateOrderDto,
        @CustomerDecorator() customer:CustomerDecoratorDto
    ):Promise<CreateOrderDto>{
        return this.orderService.createOrder(createOrderDto,customer)
    }
}