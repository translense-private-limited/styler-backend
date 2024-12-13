import { Injectable,  } from '@nestjs/common';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { ServiceExternalService } from '@modules/client/services/services/service-external.service';
import { OrderRepository } from '../repositories/order.repository';
import {  OrderDetailsInterface, OrderResponseInterface, ServiceDetailsInterface } from '../interfaces/client-orders.interface';
import { ServiceSchema } from '@modules/client/services/schema/service.schema';

@Injectable()
export class ClientOrdersService {
  constructor(
    private readonly appointmentRepository:AppointmentRepository,
    private readonly serviceExternalService:ServiceExternalService,
    private readonly orderRepository:OrderRepository,
  ) {}

  async getAllOpenOrders(clientId: number): Promise<OrderResponseInterface[]> {
    // Fetch raw results from the database
    const queryBuilder = await this.appointmentRepository.getRepository()
        .createQueryBuilder('a')
        .innerJoin('orders', 'o', 'a.orderId = o.OrderId')
        .leftJoin('order_items', 'oi', 'o.OrderId = oi.orderId')
        .innerJoin('customers', 'c', 'o.customerId = c.id')
        .where('a.status = :status', { status: 'PENDING' })
        .andWhere('c.id = :clientId', { clientId });

    const openOrders :OrderDetailsInterface[]= await queryBuilder.select([
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

    // Extract unique serviceIds
    const serviceIds = [...new Set(openOrders.map(order => order.serviceId))];

    // Fetch services by serviceIds
    const services = await this.serviceExternalService.getServicesByServiceIds(serviceIds);

    // Format the results into the desired structure
    return this.formatOrderResponse(openOrders, services);
}

private formatOrderResponse(
  openOrders: OrderDetailsInterface[],
  services: ServiceSchema[]
): OrderResponseInterface[] {
  return openOrders.reduce((acc, row) => {
    // Find or create an order object
    let order = acc.find(item => item.orderId === row.orderId);

    if (!order) {
      // Create a new order object if it doesn't exist in the accumulator
      order = {
        orderId: row.orderId,
        amountPaid: row.amountPaid,
        orderStatus: row.orderStatus,
        services: [], 
        customer: {
          customerId:row.customerId,
          customerName: row.customerName,
          customerContact: row.customerContact,
          customerEmail: row.customerEmail,
          customerImage: "", // Placeholder, can be extended if needed
        },
        appointment: {
          appointmentId: row.appointmentId,
          startTime: row.startTime,
          endTime: row.endTime,
          AppointmentStatus:row.status
        },
      };
      acc.push(order);
    }

    // Format service details
    const formattedServiceDetails = this.formatServiceDetails(row, services);

    // Add the formatted service details to the services array
    order.services.push(formattedServiceDetails);

    return acc;
  }, []); 
}

// Private method to clean up service details
private formatServiceDetails(
  row: OrderDetailsInterface,
  services: ServiceSchema[]
) :ServiceDetailsInterface{  // Ensure the return type matches the type expected for services
  const serviceDetails = services.find(service => service._id.toString() === row.serviceId.toString());

  if (!serviceDetails) {
    throw new Error(`Service with ID ${row.serviceId} not found.`);
  }

  return {
    ...serviceDetails, // Return all the properties of ServiceSchema
    quantity: row.quantity,
    notes: row.notes,
  } as ServiceDetailsInterface;
}

  async getAllOrderHistory(
    startTime: Date,
    endTime: Date,
    clientId: number,
  ): Promise<OrderResponseInterface[]> {
    const currentTime = new Date();
    if(startTime>endTime|| startTime>currentTime || endTime> currentTime){
      throw new Error ("please select valid date range");
    }
    // Fetch orders based on the startTime from AppointmentEntity
      const queryBuilder = await this.appointmentRepository.getRepository()
      .createQueryBuilder('a')
      .innerJoin('orders', 'o', 'a.orderId = o.OrderId')
      .leftJoin('order_items', 'oi', 'o.OrderId = oi.orderId')
      .innerJoin('customers', 'c', 'o.customerId = c.id')
      .where('a.status != :status', { status: 'PENDING' })
      .andWhere('c.id = :clientId', { clientId })
      .andWhere('a.startTime BETWEEN :startTime AND :endTime', { startTime, endTime });

  const openOrders :OrderDetailsInterface[]= await queryBuilder.select([
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

  // Extract unique serviceIds
  const serviceIds = [...new Set(openOrders.map(order => order.serviceId))];

  // Fetch services by serviceIds
  const services = await this.serviceExternalService.getServicesByServiceIds(serviceIds);

  // Format the results into the desired structure
  return this.formatOrderResponse(openOrders, services);

  }


  async getUpcomingOrders(
    startTime: Date, 
    endTime: Date,
    clientId: number, 
  ): Promise<OrderResponseInterface[]> {
    const currentTime = new Date();
    if(startTime<currentTime || startTime>endTime){
      throw new Error("please enter valid date range")
    }
    const bufferTime = new Date(new Date(startTime).getTime() - 30 * 60 * 1000);
    // Fetch upcoming orders based on the startTime from AppointmentEntity
    const queryBuilder = await this.appointmentRepository.getRepository().createQueryBuilder('a')
      .innerJoin('orders', 'o', 'a.orderId = o.OrderId')
      .leftJoin('order_items', 'oi', 'o.OrderId = oi.orderId')
      .innerJoin('customers', 'c', 'o.customerId = c.id')
      .where('o.customerId = :clientId', { clientId })
      .andWhere('a.startTime BETWEEN :bufferTime AND :endTime', { bufferTime, endTime }) 
      .andWhere('a.status = :status', { status: 'CONFIRMED' }) 
      
    const upcomingOrders : OrderDetailsInterface[] = await queryBuilder.select([
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

    // Extract unique serviceIds
    const serviceIds = [...new Set(upcomingOrders.map(order => order.serviceId))];

    // Fetch services by serviceIds
    const services = await this.serviceExternalService.getServicesByServiceIds(serviceIds);

    // Format the results into the desired structure
    return this.formatOrderResponse(upcomingOrders, services);
  }
}


