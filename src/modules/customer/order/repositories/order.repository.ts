import { BaseRepository } from "@src/utils/repositories/base-repository";
import { OrderEntity } from "../entities/orders.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { getMysqlDataSource } from "@modules/database/data-source";
import { Repository } from "typeorm";
import { OrderDetailsInterface } from "../interfaces/client-orders.interface";
import { BookingStatusEnum } from "../enums/booking-status.enum";

export class OrderRepository extends BaseRepository<OrderEntity>{
    constructor(
      @InjectRepository(OrderEntity,getMysqlDataSource())
      protected repository:Repository<OrderEntity>,
    ){
        super(repository)
    }

    async getAllOpenOrders(clientId: number): Promise<OrderDetailsInterface[]> {
      const queryBuilder = this.getRepository().createQueryBuilder('a')
        .innerJoin('orders', 'o', 'a.orderId = o.OrderId')
        .leftJoin('order_items', 'oi', 'o.OrderId = oi.orderId')
        .innerJoin('customers', 'c', 'o.customerId = c.id')
        .where('a.status = :status', { status: 'PENDING' })
        .andWhere('c.id = :clientId', { clientId });
  
      const openOrders: OrderDetailsInterface[] = await queryBuilder.select([
        'a.appointmentId AS appointmentId',
        'a.startTime AS startTime',
        'a.endTime AS endTime',
        'a.status AS status',
        'o.orderId AS orderId',
        'o.updatedAt AS updatedAt',
        'o.amountPaid AS amountPaid',
        'o.status AS orderStatus',
        'oi.serviceId AS serviceId',
        'oi.quantity AS quantity',
        'oi.discount AS discount',
        'oi.notes AS notes',
        'c.id AS customerId',
        'c.name AS customerName',
        'c.contactNumber AS customerContact',
        'c.email AS customerEmail',
      ]).getRawMany();
  
      return openOrders;
    }

    async getOrderHistory(
      clientId: number,
      startTime: Date,
      endTime: Date
    ): Promise<OrderDetailsInterface[]> {
      const queryBuilder = this.getRepository().createQueryBuilder('a')
        .innerJoin('orders', 'o', 'a.orderId = o.OrderId')
        .leftJoin('order_items', 'oi', 'o.OrderId = oi.orderId')
        .innerJoin('customers', 'c', 'o.customerId = c.id')
        .where('a.status != :status', { status: BookingStatusEnum.PENDING }) 
        .andWhere('c.id = :clientId', { clientId })
        .andWhere('a.startTime BETWEEN :startTime AND :endTime', { startTime, endTime });
  
      const pastOrders: OrderDetailsInterface[] = await queryBuilder.select([
        'a.appointmentId AS appointmentId',
        'a.startTime AS startTime',
        'a.endTime AS endTime',
        'a.status AS status',
        'o.orderId AS orderId',
        'o.updatedAt AS updatedAt',
        'o.amountPaid AS amountPaid',
        'o.status AS orderStatus',
        'oi.serviceId AS serviceId',
        'oi.quantity AS quantity',
        'oi.discount AS discount',
        'oi.notes AS notes',
        'c.id AS customerId',
        'c.name AS customerName',
        'c.contactNumber AS customerContact',
        'c.email AS customerEmail',
      ]).getRawMany();
  
      return pastOrders;
    }

  async getUpcomingOrders(
    clientId: number,
    bufferTime: Date,
    endTime: Date
  ): Promise<OrderDetailsInterface[]> {
    const queryBuilder = this.getRepository().createQueryBuilder('a')
      .innerJoin('orders', 'o', 'a.orderId = o.OrderId')
      .leftJoin('order_items', 'oi', 'o.OrderId = oi.orderId')
      .innerJoin('customers', 'c', 'o.customerId = c.id')
      .where('o.customerId = :clientId', { clientId })
      .andWhere('a.startTime BETWEEN :bufferTime AND :endTime', { bufferTime, endTime })
      .andWhere('a.status = :status', { status: BookingStatusEnum.CONFIRMED });

    const upcomingOrders: OrderDetailsInterface[] = await queryBuilder.select([
      'a.appointmentId AS appointmentId',
      'a.startTime AS startTime',
      'a.endTime AS endTime',
      'a.status AS status',    
      'o.orderId AS orderId',
      'o.updatedAt AS updatedAt',
      'o.amountPaid AS amountPaid',
      'o.status AS orderStatus',
      'oi.serviceId AS serviceId',
      'oi.quantity AS quantity',
      'oi.discount AS discount',
      'oi.notes AS notes',
      'c.id AS customerId',
      'c.name AS customerName',
      'c.contactNumber AS customerContact',
      'c.email AS customerEmail',
    ]).getRawMany();

    return upcomingOrders;
  }
}
