import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderEntity } from "../entities/orders.entity";

@Injectable()
export class OrderExternalService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
    ) { }

    async getOrderDetails(orderId: number, customerId: number): Promise<OrderEntity | null> {
        return await this.orderRepository.findOne({
            where: { orderId, customerId },
        });
    }
}
