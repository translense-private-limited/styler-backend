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

  // async getAllOrderHistory(
  //   startDate: Date,
  //   endDate: Date,
  //   clientId: number,
  // ): Promise<OpenOrderResponseInterface[]> {
  //   // Fetch orders based on the startTime from AppointmentEntity
  //   const orders = await this.appointmentRepository.getRepository().createQueryBuilder('a')
  //     .innerJoin('orders', 'o', 'a.orderId = o.orderId') // Join AppointmentEntity with OrderEntity
  //     .innerJoin('customers', 'c', 'o.customerId = c.id') // Join with customers table to get customer details
  //     .select([
  //       'c.name AS customerName',
  //       'c.contactNumber AS customerContact',
  //       'c.email AS customerEmail',
  //       'o.orderId AS orderId',
  //       'a.startTime AS startTime',
  //       'a.endTime AS endTime',
  //       'a.actualStartTime AS actualStartTime',
  //       'a.actualEndTime AS actualEndTime',
  //       'o.amountPaid AS amountPaid',
  //       'o.status AS status',
  //     ])
  //     .where('o.customerId = :clientId', { clientId })
  //     .andWhere('a.startTime BETWEEN :startDate AND :endDate', { startDate, endDate }) // Filter by startTime from AppointmentEntity
  //     .getRawMany();
  
  //   // If no orders exist, return an empty array
  //   console.log("the orders are", orders);
  //   if (orders.length === 0) {
  //     return [];
  //   }
  
  //   // Format the orders to match the desired response structure
  //   const formattedOrders = orders.map(order => ({
  //     customer: {
  //       customerName: order.customerName,
  //       customerContact: order.customerContact,
  //       customerEmail: order.customerEmail,
  //     },
  //     appointment: {
  //       appointmentId: order.orderId, // Use orderId as a placeholder for appointmentId if not available
  //       startTime: order.startTime,
  //       endTime: order.endTime,
  //       actualStartTime: order.actualStartTime,
  //       actualEndTime: order.actualEndTime,
  //     },
  //     orderId: order.orderId,
  //     amountPaid: order.amountPaid ?? 0,
  //     status: order.status,
  //   }));
  
  //   console.log("formatted orders are:", formattedOrders);
  //   // Return the orders in the desired format
  //   return formattedOrders;
  // }
  

  async getUpcomingOrders(
    startDate: Date, 
    endDate: Date,
    clientId: number, 
  ): Promise<OrderResponseInterface[]> {
    const currentDate = new Date();
    const bufferTime = new Date(currentDate.getTime() - 30 * 60 * 1000);
    // Fetch upcoming orders based on the startTime from AppointmentEntity
    const queryBuilder = await this.appointmentRepository.getRepository().createQueryBuilder('a')
      .innerJoin('orders', 'o', 'a.orderId = o.OrderId')
      .leftJoin('order_items', 'oi', 'o.OrderId = oi.orderId')
      .innerJoin('customers', 'c', 'o.customerId = c.id')
      .where('o.customerId = :clientId', { clientId })
      .andWhere('a.startTime BETWEEN :bufferTime AND :endDate', { bufferTime, endDate }) 
      .andWhere('a.startTime > :currentDate', { currentDate: new Date() }) 
      .andWhere('o.status != :status', { status: 'CONFIRMED' })  // Exclude orders with status 'PENDING'
      
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


