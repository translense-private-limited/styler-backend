import { Injectable,  } from '@nestjs/common';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { ServiceExternalService } from '@modules/client/services/services/service-external.service';
import { OrderRepository } from '../repositories/order.repository';
import {  OrderDetailsInterface, OrderResponseInterface, ServiceDetailsInterface } from '../interfaces/client-orders.interface';
import { ServiceSchema } from '@modules/client/services/schema/service.schema';
import { OrderFilterDto } from '../dtos/order-filter.dto';

@Injectable()
export class ClientOrdersService {
  constructor(
    private readonly appointmentRepository:AppointmentRepository,
    private readonly serviceExternalService:ServiceExternalService,
    private readonly orderRepository:OrderRepository,
  ) {}

  async getAllOpenOrders(clientId: number): Promise<OrderResponseInterface[]> {
    // Fetch raw results from the database
    const openOrders:OrderDetailsInterface[] = await this.orderRepository.getAllOpenOrders(clientId)

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
    clientId: number,
    dateRange: OrderFilterDto
  ): Promise<OrderResponseInterface[]> {

    const {startTime,endTime} = dateRange;
    const currentTime = new Date();

    if (startTime > endTime) {
      throw new Error("Start time cannot be later than end time.");
    }
    if (endTime > currentTime) {
      throw new Error("End time should be in the past.");
    }

    const pastOrders: OrderDetailsInterface[] = await this.orderRepository.getOrderHistory(clientId,startTime,endTime);
    // Extract unique serviceIds
    const serviceIds = [...new Set(pastOrders.map(order => order.serviceId))];

    // Fetch services by serviceIds
    const services = await this.serviceExternalService.getServicesByServiceIds(serviceIds);

    // Format the results into the desired structure
    return this.formatOrderResponse(pastOrders, services);

  }


  async getUpcomingOrders(
    clientId: number, 
    dateRange:OrderFilterDto
  ): Promise<OrderResponseInterface[]> {
    const {startTime,endTime} = dateRange;
    const currentTime = new Date();
    if (startTime > endTime) {
      throw new Error("Start time cannot be later than end time.");
    }
    if (startTime < currentTime) {
      throw new Error("Start time cannot be in the past.");
    }
    const bufferTime = new Date(new Date(startTime).getTime() - 30 * 60 * 1000);
    // Fetch upcoming orders based on the startTime from AppointmentEntity
    const upcomingOrders: OrderDetailsInterface[] = await this.orderRepository.getUpcomingOrders(clientId,bufferTime,endTime);

    // Extract unique serviceIds
    const serviceIds = [...new Set(upcomingOrders.map(order => order.serviceId))];

    // Fetch services by serviceIds
    const services = await this.serviceExternalService.getServicesByServiceIds(serviceIds);

    // Format the results into the desired structure
    return this.formatOrderResponse(upcomingOrders, services);
  }
}


