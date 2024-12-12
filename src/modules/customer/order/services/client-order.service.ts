import { Injectable } from '@nestjs/common';
import { Between, In } from 'typeorm';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { OrderRepository } from '../repositories/order.repository';
import { BookingStatusEnum } from '../enums/booking-status.enum';
import { OrderItemRepository } from '../repositories/order-item.repository';
import { CustomerExternalService } from '@modules/customer/services/customer-external.service';
import { ServiceExternalService } from '@modules/client/services/services/service-external.service';
import { OrderItemService } from './order-item.service';
import { OpenOrderDetailsInterface, ServiceDetailsInterface } from '../interfaces/open-orders-details.interface';
import { OrderItemEntity } from '../entities/order-item.entity';

@Injectable()
export class ClientOrdersService {
  constructor(
    private readonly appointmentRepository:AppointmentRepository,
    private readonly orderRepository:OrderRepository,
    private readonly orderItemsRepository:OrderItemRepository,
    private readonly customerExternalService:CustomerExternalService,
    private readonly serviceExternalService:ServiceExternalService,
    private readonly orderItemService:OrderItemService
  ) {}

  async getAllOpenOrders(startTime: Date, endTime: Date): Promise<OpenOrderDetailsInterface[]> {
    // Step 1: Fetch appointments within the time range with status "pending"
    const appointments = await this.appointmentRepository.getRepository().find({
      where: {
        startTime: Between(new Date(startTime), new Date(endTime)),
        status: BookingStatusEnum.PENDING,
      },
    });
  
    const orderIds = appointments.map((appointment) => appointment.orderId);
    if (orderIds.length === 0) return []; // Return empty array if no pending appointments
  
    // Step 2: Fetch orders using orderIds
    const orders = await this.orderRepository.getRepository().find({
      where: {
        orderId: In(orderIds),
      },
    });
  
    // Step 3: Create a map for quick lookup of appointment times by orderId
    const appointmentMap = appointments.reduce((map, appointment) => {
      map[appointment.orderId] = appointment.actualEndTime? appointment.actualEndTime:appointment.startTime;
      return map;
    }, {} as Record<number, Date>);
  
    // Step 4: Fetch customer and service details in parallel
    const orderItemsPromises = orders.map(async (order) => {
      const customerPromise = this.customerExternalService.getCustomerByIdOrThrow(order.customerId);
      const orderItemsPromise = this.orderItemService.getAllOrderItemsByOrderId(order.orderId);
  
      const [customer, orderItems] = await Promise.all([customerPromise, orderItemsPromise]);
  
      // Step 5: Fetch service details for all order items
      const servicesPromise = this.fetchServiceDetailsForOrderItems(orderItems);
  
      // Step 6: Construct the response object with appointment time from the map
      const services = await servicesPromise;
  
      // Fetch appointment time from the appointmentMap (O(1) lookup)
      const appointmentTime = appointmentMap[order.orderId] || null;
  
      return {
        orderId: order.orderId,
        amountPaid: order.amountPaid,
        services,
        time: appointmentTime, // Set appointment time here
        customerName: customer.name,
        customerImage: '', // Assuming you have imageUrl in the customer data
        contact: customer.contactNumber,
        email: customer.email,
      };
    });
  
    // Step 7: Wait for all order details to be fetched and return the result
    return Promise.all(orderItemsPromises);
  }
  
  // Helper function to fetch service details for order items
  private async fetchServiceDetailsForOrderItems(orderItems: OrderItemEntity[]): Promise<ServiceDetailsInterface[]> {
    const services = await Promise.all(
      orderItems.map(async (item) => {
        const service = await this.serviceExternalService.getServiceByIdOrThrow(item.serviceId);
        return {
          serviceId: item.serviceId,
          serviceName: service.serviceName,
          price: service.price, // Or adjust as per your service fields
        };
      })
    );
    return services;
  }  
  
}
