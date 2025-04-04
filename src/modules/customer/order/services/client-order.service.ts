import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { ServiceExternalService } from '@modules/client/services/services/service-external.service';
import { OrderRepository } from '../repositories/order.repository';
import {
  OrderDetailsInterface,
  OrderResponseInterface,
  ServiceDetailsInterface,
} from '../interfaces/client-orders.interface';
import { ServiceSchema } from '@modules/client/services/schema/service.schema';
import { OrderFilterDto } from '../dtos/order-filter.dto';
import { OrderConfirmationDto } from '../dtos/order-confirmation.dto';
import { OrderItemService } from './order-item.service';
import { OrderItemStatusEnum } from '../enums/order-item-status.enum';
import { BookingStatusEnum } from '../enums/booking-status.enum';
import { AppointmentService } from './appointment.service';
import { throwIfNotFound } from '@src/utils/exceptions/common.exception';
import { OrderService } from './order.service';
import { QueryRunner } from 'typeorm';
import { OrderEntity } from '../entities/orders.entity';
import { ClientIdDto } from '@src/utils/dtos/client-id.dto';
import { ClientExternalService } from '@modules/client/client/services/client-external.service';
import { TimeSlotDto } from '../dtos/time-slot.dto';
import { OrderFulfillmentOtpService } from './order-fulfillment-otp.service';
import { AppointmentEntity } from '../entities/appointment.entity';
import { OtpTypeEnum } from '../enums/otp-type.enum';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { FulfillOrderDto } from '../dtos/order-fulfill.dto';
import { FulfillOrderResponseInterface } from '../interfaces/order-fulfill-response.interface';
import { CreateWalkInCustomerOrderDto } from '../dtos/create-order-walk-in-customer.dto';
import { OrderResponseDto } from '../dtos/order-response.dto';
import { CustomerExternalService } from '@modules/customer/services/customer-external.service';
import { CustomerDecoratorDto } from '@src/utils/dtos/customer-decorator.dto';
import { CustomerEntity } from '@modules/customer/entities/customer.entity';
import { CustomerSignupWithoutOtpDto } from '@modules/authentication/dtos/customer-signup-without-otp.dto';
import { convertToUTC } from '@src/utils/timeZone/convert-to-utc';

@Injectable()
export class ClientOrderService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly serviceExternalService: ServiceExternalService,
    private readonly orderRepository: OrderRepository,
    private readonly orderItemService: OrderItemService,
    private readonly appointmentService: AppointmentService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly clientExternalService: ClientExternalService,
    private readonly orderFulfillmentOtpService: OrderFulfillmentOtpService,
    private customerExternalService: CustomerExternalService,

  ) { }

  async getAllOpenOrders(clientId: number): Promise<OrderResponseInterface[]> {
    const outletId = await this.getOutletIdByClientId(clientId);

    // Fetch raw results from the database
    const openOrders: OrderDetailsInterface[] =
      await this.appointmentRepository.getAllOpenOrders(clientId, outletId);

    // Extract unique serviceIds
    const serviceIds = [...new Set(openOrders.map((order) => order.serviceId))];

    // Fetch services by serviceIds
    const services =
      await this.serviceExternalService.getServicesByServiceIds(serviceIds);

    // Format the results into the desired structure
    return this.formatOrderResponse(openOrders, services);
  }

  formatOrderResponse(
    openOrders: OrderDetailsInterface[],
    services: ServiceSchema[],
  ): OrderResponseInterface[] {
    return openOrders.reduce((acc, row) => {
      // Find or create an order object
      let order = acc.find((item) => item.orderId === row.orderId);

      if (!order) {
        // Create a new order object if it doesn't exist in the accumulator
        order = {
          orderId: row.orderId,
          amountPaid: row.amountPaid,
          orderStatus: row.orderStatus,
          services: [],
          customer: {
            customerId: row.customerId,
            customerName: row.customerName,
            customerContact: row.customerContact,
            customerEmail: row.customerEmail,
            customerImage: '', // Placeholder, can be extended if needed
          },
          appointment: {
            appointmentId: row.appointmentId,
            startTime: row.startTime,
            endTime: row.endTime,
            AppointmentStatus: row.status,
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
  formatServiceDetails(
    row: OrderDetailsInterface,
    services: ServiceSchema[],
  ): ServiceDetailsInterface {
    // Ensure the return type matches the type expected for services
    const serviceDetails = services.find(
      (service) => service._id.toString() === row.serviceId.toString(),
    );

    if (!serviceDetails) {
      throw new Error(`Service with ID ${row.serviceId} not found.`);
    }

    return {
      ...serviceDetails, // Return all the properties of ServiceSchema
      quantity: row.quantity,
      notes: row.notes,
    } as ServiceDetailsInterface;
  }

  async createOrderForWalkInCustomer(createWalkInCustomerOrderDto: CreateWalkInCustomerOrderDto, clientIdDto: ClientIdDto,
  ): Promise<OrderResponseDto> {
    const customer = await this.getExistingOrCreateNewCustomer(createWalkInCustomerOrderDto);
    if (!customer?.id) {
      throw new Error('Failed to retrieve or create customer.');
    }
    const customerOrderDto: CustomerDecoratorDto = {
      contactNumber: customer.contactNumber,
      customerId: customer.id,
      email: customer.email,
      name: customer.name,
      whitelabelId: customer.whitelabelId
    }
    const orderResponse = await this.orderService.createOrder(createWalkInCustomerOrderDto, customerOrderDto);
    const serviceIds = createWalkInCustomerOrderDto.orderItems.map(item => item.serviceId);
    const orderConfirmationDto: OrderConfirmationDto = {
      accept: serviceIds,
      reject: [],
      reasonForRejection: ""
    };
    await this.confirmOrder(orderResponse.orderId,
      orderConfirmationDto, createWalkInCustomerOrderDto.outletId
      , clientIdDto);

    return orderResponse;
  }
  async getExistingOrCreateNewCustomer(createOrderDto: CreateWalkInCustomerOrderDto): Promise<CustomerEntity> {
    let customer = await this.getExistingCustomer(createOrderDto.email, createOrderDto.contactNumber);

    if (!customer) {
      const customerSignupWithoutOtpDto: CustomerSignupWithoutOtpDto = {
        email: createOrderDto.email,
        password: createOrderDto.contactNumber.toString(),
        contactNumber: createOrderDto.contactNumber,
        name: createOrderDto.name,
      };
      customer = await this.customerExternalService.createCustomerWithoutOtp(customerSignupWithoutOtpDto);
    }

    return customer;
  }

  async getExistingCustomer(email: string, contactNumber: number): Promise<CustomerEntity | null> {
    let customer = await this.customerExternalService.getCustomerByContactNumber(contactNumber);
    if (!customer) {
      customer = await this.customerExternalService.getCustomerByEmail(email);
    };
    return customer || null;
  }
  async getAllOrderHistoryForClient(
    clientId: number,
    dateRange: OrderFilterDto,
  ): Promise<OrderResponseInterface[]> {
    const outletId = await this.getOutletIdByClientId(clientId);
    const { startTime, endTime } = dateRange;
    const currentTime = new Date();

    if (startTime > endTime) {
      throw new Error('Start time cannot be later than end time.');
    }
    if (new Date(endTime) > currentTime) {
      throw new Error('End time should be in the past.');
    }

    const pastOrders: OrderDetailsInterface[] =
      await this.appointmentRepository.getOrderHistoryForClient(
        outletId,
        startTime,
        endTime,
      );
    // Extract unique serviceIds
    const serviceIds = [...new Set(pastOrders.map((order) => order.serviceId))];

    // Fetch services by serviceIds
    const services =
      await this.serviceExternalService.getServicesByServiceIds(serviceIds);

    // Format the results into the desired structure
    return this.formatOrderResponse(pastOrders, services);
  }

  async getAllCompletedOrdersForClient(
    clientId: number,
    dateRange: OrderFilterDto,
  ): Promise<OrderResponseInterface[]> {
    const outletId = await this.getOutletIdByClientId(clientId);
    const { startTime, endTime } = dateRange;
    const currentTime = new Date();

    if (startTime > endTime) {
      throw new Error('Start time cannot be later than end time.');
    }
    if (new Date(endTime) > currentTime) {
      throw new Error('End time should be in the past.');
    }

    const pastOrders: OrderDetailsInterface[] =
      await this.appointmentRepository.getCompletedOrdersForClient(
        outletId,
        startTime,
        endTime,
      );
    // Extract unique serviceIds
    const serviceIds = [...new Set(pastOrders.map((order) => order.serviceId))];

    // Fetch services by serviceIds
    const services =
      await this.serviceExternalService.getServicesByServiceIds(serviceIds);

    // Format the results into the desired structure
    return this.formatOrderResponse(pastOrders, services);
  }

  async getUpcomingOrdersForClient(
    clientId: number,
    dateRange: OrderFilterDto,
  ): Promise<OrderResponseInterface[]> {
    const outletId = await this.getOutletIdByClientId(clientId);
    let { startTime, endTime } = dateRange;
    startTime = convertToUTC(startTime);
    endTime = convertToUTC(endTime);
    const currentTime = new Date();
    if (startTime > endTime) {
      throw new Error('Start time cannot be later than end time.');
    }
    if (startTime.getTime() < currentTime.getTime() - 5000) {
      throw new Error('Start time cannot be in the past.');
    }
    
    const bufferTime = new Date(new Date(startTime).getTime() - 30 * 60 * 1000);
    // Fetch upcoming orders based on the startTime from AppointmentEntity
    const upcomingOrdersForClient: OrderDetailsInterface[] =
      await this.appointmentRepository.getUpcomingOrdersForClient(
        outletId,
        bufferTime,
        endTime,
      );

    // Extract unique serviceIds
    const serviceIds = [
      ...new Set(upcomingOrdersForClient.map((order) => order.serviceId)),
    ];

    // Fetch services by serviceIds
    const services =
      await this.serviceExternalService.getServicesByServiceIds(serviceIds);

    // Format the results into the desired structure
    return this.formatOrderResponse(upcomingOrdersForClient, services);
  }

  async confirmOrder(
    orderId: number,
    orderConfirmationDto: OrderConfirmationDto,
    clientId: number,
    clientIdDto: ClientIdDto,
  ): Promise<string> {
    const order = await this.orderService.getOrderByIdOrThrow(orderId);
    if (!clientIdDto.outletIds.includes(order.outletId)) {
      throw new Error(`you are not authorized to take action on this order`);
    }
    const { accept, reject, reasonForRejection } = orderConfirmationDto;

    const queryRunner = this.orderRepository
      .getRepository()
      .manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // Step 1: Validate the order and update the reason if any service is rejected
      const order = await this.getAndUpdateOrderDetails(
        queryRunner,
        orderId,
        reject,
        reasonForRejection,
      );

      // Step 2: Update order items
      if (reject && reject.length > 0) {
        await this.updateOrderItemsStatus(queryRunner, orderId, accept, reject);
      }

      // Step 3: Update appointment status
      if (accept && accept.length > 0) {
        const appointment = await this.updateAppointmentStatus(queryRunner, orderId, BookingStatusEnum.CONFIRMED);
        await this.orderFulfillmentOtpService.generateOtp(clientId, order.customerId, orderId, appointment.endTime, OtpTypeEnum.ORDER)
      }
      else {
        await this.updateAppointmentStatus(queryRunner, orderId, BookingStatusEnum.CANCELLED_BY_SALON);
      }

      // Commit the transaction
      await queryRunner.commitTransaction();
      return 'Booking Confirmed';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async getAndUpdateOrderDetails(
    queryRunner: QueryRunner,
    orderId: number,
    reject: string[],
    reasonForRejection: string,
  ): Promise<OrderEntity> {
    const order = await this.orderService.getOrderByIdOrThrow(orderId);
    throwIfNotFound(order, 'Order not found with the provided orderId');

    if (reject && reject.length > 0) {
      if (!reasonForRejection) {
        throw new Error(
          'A rejection reason must be provided when services are rejected.',
        );
      }

      // Update the reasonForRejection for the order within the transaction
      order.reasonForRejection = reasonForRejection;
      await queryRunner.manager.save(order);
    }
    return order;
  }

  private async updateOrderItemsStatus(
    queryRunner: QueryRunner,
    orderId: number,
    accept: string[],
    reject: string[],
  ): Promise<void> {
    const orderItems =
      await this.orderItemService.getAllOrderItemsByOrderId(orderId);

    const updatedOrderItems = orderItems.map((item) => {
      if (reject.includes(item.serviceId)) {
        item.status = OrderItemStatusEnum.REJECTED;
      }
      return item;
    });

    await queryRunner.manager.save(updatedOrderItems);
  }

  private async updateAppointmentStatus(
    queryRunner: QueryRunner,
    orderId: number,
    status: BookingStatusEnum
  ): Promise<AppointmentEntity> {
    const appointment =
      await this.appointmentService.getAppointmentByOrderIdOrThrow(orderId);
    throwIfNotFound(
      appointment,
      'Appointment not found for the provided orderId',
    );

    appointment.status = status;
    return await queryRunner.manager.save(appointment);
  }

  private async getOutletIdByClientId(clientId: number): Promise<number> {
    const client = await this.clientExternalService.getClientById(clientId);
    return client.outletId;
  }

  async rescheduleOrder(orderId: number, rescheduledTimeSlot: TimeSlotDto): Promise<string> {
    const appointment = await this.appointmentRepository.getRepository().findOne({ where: { orderId } })

    appointment.status = BookingStatusEnum.RESCHEDULED;
    Object.assign(appointment, rescheduledTimeSlot)

    await this.appointmentRepository.getRepository().save(appointment)
    return 'rescheduled the order successfully';
  }

  async fulFillTheOrder(clientId: number, orderId: number, fulfillOrderDto: FulfillOrderDto): Promise<FulfillOrderResponseInterface> {
    const { otp, paymentMode, amountReceived } = fulfillOrderDto;
    // Step 1: Validate the OTP using the existing method
    await this.orderFulfillmentOtpService.validateOtp(otp, OtpTypeEnum.ORDER);

    // Step 2: Update the order status to "COMPLETED"
    const order = await this.orderService.getOrderByIdOrThrow(orderId)
    order.status = OrderStatusEnum.ORDER_COMPLETED;

    await this.orderRepository.getRepository().save(order);

    // Step 3: Update the associated appointment status to "COMPLETED"
    const appointment = await this.appointmentService.getAppointmentByOrderIdOrThrow(orderId)

    appointment.status = BookingStatusEnum.COMPLETED;
    await this.appointmentRepository.getRepository().save(appointment);

    return {
      orderId,
      otp,
      paymentMode,
      amountReceived
    };
    //console.log(`Order ${orderId} and its associated appointment have been marked as completed.`);
  }


}
