import { Injectable,  } from '@nestjs/common';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { ServiceExternalService } from '@modules/client/services/services/service-external.service';
import { OrderRepository } from '../repositories/order.repository';
import { FetchOpenOrderInterface, FormattedServiceDetailsInterface, OpenOrderResponseInterface } from '../interfaces/open-orders.interface';
import { ServiceSchema } from '@modules/client/services/schema/service.schema';
import { OrderHistoryResponseInterface } from '../interfaces/order-history-response.interface';
import { UpcomingOrdersResponseInterface } from '../interfaces/upcoming-order.interface';

@Injectable()
export class ClientOrdersService {
  constructor(
    private readonly appointmentRepository:AppointmentRepository,
    private readonly serviceExternalService:ServiceExternalService,
    private readonly orderRepository:OrderRepository,
  ) {}

  async getAllOpenOrders(startTime: Date, endTime: Date, clientId: number): Promise<OpenOrderResponseInterface[]> {
    // Fetch raw results from the database
    const results = await this.fetchOpenOrders(startTime, endTime, clientId);
  
    // Create a service details map
    const serviceDetailsMap = await this.fetchOpenOrderServiceDetails(results);
  
    // Format the results into the desired structure
    return this.formatOpenOrderResults(results, serviceDetailsMap);
  }
  
  // Private method to fetch open orders from the database
  private async fetchOpenOrders(startTime: Date, endTime: Date, clientId: number): Promise<FetchOpenOrderInterface[]> {
    const queryBuilder = this.appointmentRepository.getRepository()
      .createQueryBuilder('a')
      .innerJoin('orders', 'o', 'a.orderId = o.OrderId')
      .leftJoin('order_items', 'oi', 'o.OrderId = oi.orderId')
      .innerJoin('customers', 'c', 'o.customerId = c.id')
      .where('a.status = :status', { status: 'PENDING' })
      .andWhere('a.startTime BETWEEN :startTime AND :endTime', { startTime, endTime })
      .andWhere('c.id = :clientId', { clientId });
  
    return queryBuilder.select([
      'a.appointmentId AS appointmentId',
      'a.startTime AS startTime',
      'a.endTime AS endTime',
      'o.orderId AS orderId',
      'o.updatedAt AS updatedAt',
      'o.amountPaid As amountPaid',
      'oi.serviceId AS serviceId',
      'oi.quantity AS quantity',
      'oi.discount AS discount',
      'oi.notes AS notes',
      'c.name AS customerName',
      'c.contactNumber AS customerContact',
      'c.email AS customerEmail',
    ]).getRawMany();
  }
  
  // Private method to fetch service details for all serviceIds
  private async fetchOpenOrderServiceDetails(results: FetchOpenOrderInterface[]): Promise<Map<string, ServiceSchema>> {
    const serviceDetailsMap = new Map<string, ServiceSchema>();
    await Promise.all(
      results.map(async (row) => {
        if (!serviceDetailsMap.has(row.serviceId)) {
          const serviceDetails = await this.serviceExternalService.getServiceByIdOrThrow(row.serviceId);
          serviceDetailsMap.set(row.serviceId, serviceDetails);
        }
      })
    );
    return serviceDetailsMap;
  }
  
  // Private method to format the results into the desired structure
  private formatOpenOrderResults(results: FetchOpenOrderInterface[], serviceDetailsMap: Map<string, ServiceSchema>): OpenOrderResponseInterface[] {
    return results.reduce((acc, row) => {
      // Find or create an order object
      let order = acc.find(item => item.orderId === row.orderId);
      if (!order) {
        order = {
          customerName: row.customerName,
          orderId: row.orderId,
          Amount: row.amountPaid, 
          services: [],
          time: row.startTime,
          customerImage: "",
          contact: row.customerContact,
          email: row.customerEmail,
        };
        acc.push(order);
      }
  
      // Clean service details
      const formattedServiceDetails = this.formatServiceDetails(row, serviceDetailsMap);
  
      // Add service details to the order
      order.services.push(formattedServiceDetails);
  
      return acc;
    }, []);
  }
  
  // Private method to clean up service details
  private formatServiceDetails(row: FetchOpenOrderInterface, serviceDetailsMap: Map<string, ServiceSchema>): FormattedServiceDetailsInterface {
    const serviceDetails = serviceDetailsMap.get(row.serviceId);
    return {
      serviceId: serviceDetails._id,
      serviceName: serviceDetails.serviceName,
      type: serviceDetails.type,
      price: serviceDetails.price,
      discount: serviceDetails.discount,
      timeTaken: serviceDetails.timeTaken,
      about: serviceDetails.about,
      description: serviceDetails.description,
      outletId: serviceDetails.outletId,
      quantity: row.quantity,
      notes: row.notes,
    };
  }
  async getAllOrderHistory(
    startDate: Date, 
    endDate: Date,
    clientId: number, 
  ): Promise<OrderHistoryResponseInterface[]> {
    // Fetch orders based on the startTime from AppointmentEntity
    const orders = await this.appointmentRepository.getRepository().createQueryBuilder('a')
      .innerJoin('orders', 'o', 'a.orderId = o.orderId')  // Join AppointmentEntity with OrderEntity
      .innerJoin('customers', 'c', 'o.customerId = c.id')  // Join with customers table to get customer name
      .select([
        'c.name AS customerName',
        'o.orderId as orderId',
        'a.startTime AS time',  // Use startTime from AppointmentEntity
        'o.amountPaid as amountPaid',
        'o.status as status',
      ])
      .where('o.customerId = :clientId', { clientId })
      .andWhere('a.startTime BETWEEN :startDate AND :endDate', { startDate, endDate })  // Filter by startTime from AppointmentEntity
      .getRawMany();
  
    // If no orders exist, return "No orders"
    console.log("the orders are",orders)
    if (orders.length === 0) {
      return []; 
    }
  
    // Format the orders to match the response structure
    const formattedOrders = orders.map(order => ({
      customerName: order.customerName,
      orderId: order.orderId,
      time: new Date(order.time).toLocaleString(),
      amountPaid: order.amountPaid,  // Default to 0 if amountPaid is not available
      status: order.status,
    }));
    console.log("formatted orders are:",formattedOrders)
    // Return the orders in the desired format
    return  formattedOrders;
  }

  async getUpcomingOrders(
    startDate: Date, 
    endDate: Date,
    clientId: number, 
  ): Promise<UpcomingOrdersResponseInterface[]> {
    // Fetch upcoming orders based on the startTime from AppointmentEntity
    const orders = await this.appointmentRepository.getRepository().createQueryBuilder('a')
      .innerJoin('orders', 'o', 'a.orderId = o.orderId')  // Join AppointmentEntity with OrderEntity
      .innerJoin('customers', 'c', 'o.customerId = c.id')  // Join with customers table to get customer name
      .select([
        'c.name AS customerName',
        'o.orderId AS o_orderId',  // Alias for orderId
        'a.startTime AS time',  // Use startTime from AppointmentEntity
        'o.amountPaid AS o_amountPaid',  // Alias for amountPaid
        'o.status AS o_status',  // Alias for status
      ])
      .where('o.customerId = :clientId', { clientId })
      .andWhere('a.startTime BETWEEN :startDate AND :endDate', { startDate, endDate })  // Filter by startTime from AppointmentEntity
      .andWhere('a.startTime > :currentDate', { currentDate: new Date() })  // Only upcoming orders
      .andWhere('o.status != :status', { status: 'PENDING' })  // Exclude orders with status 'PENDING'
      .getRawMany();
  
    // If no orders exist, return empty arr
    if (orders.length === 0) {
      return []; 
    }
  
    // Format the orders to match the response structure
    const formattedOrders = orders.map(order => ({
      customerName: order.customerName,
      customerImage: '', // Use a placeholder if no image
      orderId: order.o_orderId,
      time: order.time,
      amountPaid: order.o_amountPaid, 
    }));
  
    // Return the upcoming orders in the desired format
    return formattedOrders;
  }
  
}


