import { Controller, Get, Param, Query } from "@nestjs/common";
import { CustomerOrderService } from "../services/customer-order.service";
import { OrderFilterDto } from "../dtos/order-filter.dto";

@Controller('customer')
export class CustomerOrderController{
    constructor(
        private readonly customerOrderService:CustomerOrderService
    ){}

    @Get('/:customerId/upcoming-orders')
    async getUpcomingOrders(
        @Param('customerId') customerId:number,
        @Query() dateRange:OrderFilterDto
    ){
        console.log(customerId);
        return this.customerOrderService.getUpcomingOrders(customerId,dateRange);
    }
}