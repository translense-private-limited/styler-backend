import { InjectRepository } from '@nestjs/typeorm';
import { getMysqlDataSource } from '@modules/database/data-source';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/utils/repositories/base-repository';
import { AppointmentEntity } from '../entities/appointment.entity';
import { OrderDetailsInterface } from '../interfaces/client-orders.interface';
import { BookingStatusEnum } from '../enums/booking-status.enum';

export class AppointmentRepository extends BaseRepository<AppointmentEntity> {
  constructor(
    @InjectRepository(AppointmentEntity, getMysqlDataSource())
    protected repository: Repository<AppointmentEntity>,
  ) {
    super(repository);
  }
  async getAllOpenOrders(clientId: number,outletId:number): Promise<OrderDetailsInterface[]> {
    const queryBuilder = this.getRepository().createQueryBuilder('a')
      .innerJoin('orders', 'o', 'a.orderId = o.OrderId')
      .leftJoin('order_items', 'oi', 'o.OrderId = oi.orderId')
      .innerJoin('customers', 'c', 'o.customerId = c.id')
      .where('a.status = :status', { status: 'PENDING' })
      .andWhere('a.outletId = :outletId', { outletId });

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

  async getOrderHistoryForClient(
    outletId:number,
    startTime: Date,
    endTime: Date
  ): Promise<OrderDetailsInterface[]> {
    const queryBuilder = this.getRepository().createQueryBuilder('a')
      .innerJoin('orders', 'o', 'a.orderId = o.OrderId')
      .leftJoin('order_items', 'oi', 'o.OrderId = oi.orderId')
      .innerJoin('customers', 'c', 'o.customerId = c.id')
      .where('a.status != :status', { status: BookingStatusEnum.PENDING }) 
      .andWhere('a.outletId = :outletId', { outletId })
      .andWhere('a.startTime BETWEEN :startTime AND :endTime', { startTime, endTime });

    const pastOrdersForClient: OrderDetailsInterface[] = await queryBuilder.select([
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

    return pastOrdersForClient;
  }

async getUpcomingOrdersForClient(
  outletId:number,
  bufferTime: Date,
  endTime: Date
): Promise<OrderDetailsInterface[]> {
  const queryBuilder = this.getRepository().createQueryBuilder('a')
    .innerJoin('orders', 'o', 'a.orderId = o.orderId')
    .leftJoin('order_items', 'oi', 'o.orderId = oi.orderId')
    .innerJoin('customers', 'c', 'o.customerId = c.id')
    .where('a.outletId = :outletId', { outletId })
    .andWhere('a.startTime BETWEEN :bufferTime AND :endTime', { bufferTime, endTime })
    .andWhere('a.status = :status', { status: BookingStatusEnum.CONFIRMED });

  const upcomingOrdersForClient: OrderDetailsInterface[] = await queryBuilder.select([
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

  return upcomingOrdersForClient;
 }

 async getUpcomingOrdersForCustomer(
  customerId:number,
): Promise<OrderDetailsInterface[]> {
  const queryBuilder = this.getRepository().createQueryBuilder('a')
    .innerJoin('orders', 'o', 'a.orderId = o.orderId')
    .leftJoin('order_items', 'oi', 'o.orderId = oi.orderId')
    .innerJoin('customers', 'c', 'o.customerId = c.id')
    .where('a.customerId = :customerId', { customerId })
    .andWhere('a.status = :status', { status: BookingStatusEnum.CONFIRMED });

  const upcomingOrdersForCustomer: OrderDetailsInterface[] = await queryBuilder.select([
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

  return upcomingOrdersForCustomer;
 }

 async getOrderHistoryForCustomer(
  customerId:number,
): Promise<OrderDetailsInterface[]> {
  const queryBuilder = this.getRepository().createQueryBuilder('a')
    .innerJoin('orders', 'o', 'a.orderId = o.OrderId')
    .leftJoin('order_items', 'oi', 'o.OrderId = oi.orderId')
    .innerJoin('customers', 'c', 'o.customerId = c.id')
    .where('a.status != :status', { status: BookingStatusEnum.PENDING }) 
    .andWhere('a.customerId = :customerId', { customerId })

  const pastOrdersForCustomer: OrderDetailsInterface[] = await queryBuilder.select([
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

  return pastOrdersForCustomer;
}
}
