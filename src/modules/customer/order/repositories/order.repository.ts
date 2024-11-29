import { BaseRepository } from "@src/utils/repositories/base-repository";
import { OrderEntity } from "../entities/orders.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { getMysqlDataSource } from "@modules/database/data-source";
import { Repository } from "typeorm";

export class OrderRepositoy extends BaseRepository<OrderEntity>{
    constructor(
      @InjectRepository(OrderEntity,getMysqlDataSource())
      protected repository:Repository<OrderEntity>,
    ){
        super(repository)
    }
}
