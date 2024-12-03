import { InjectRepository } from "@nestjs/typeorm";
import { OrderItemEntity } from "../entities/order-item.entity";
import { getMysqlDataSource } from "@modules/database/data-source";
import { Repository } from "typeorm";
import { BaseRepository } from "@src/utils/repositories/base-repository";

export class OrderItemRepository extends BaseRepository<OrderItemEntity>{
    constructor(
        @InjectRepository(OrderItemEntity,getMysqlDataSource())
        protected repository: Repository<OrderItemEntity>,
    ){
        super(repository)
    }
}