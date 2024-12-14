import { Controller, Get, Param, Query } from "@nestjs/common";
import { CustomerOrderService } from "../services/customer-order.service";
import { OrderFilterDto } from "../dtos/order-filter.dto";
import { OrderResponseInterface } from "../interfaces/client-orders.interface";

@Controller('customer')
export class CustomerOrderController{
    constructor(
        private readonly customerOrderService:CustomerOrderService
    ){}

    @Get('/:customerId/upcoming-orders')
    async getUpcomingOrders(
        @Param('customerId') customerId:number,
        @Query() dateRange:OrderFilterDto
    ):Promise<OrderResponseInterface[]>{
        console.log(customerId);
        return this.customerOrderService.getUpcomingOrders(customerId,dateRange);
    }
}