import { CreateAppointmentDto } from './../dtos/create-appointment.interface';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderItemPayloadDto } from '../dtos/order-item.dto';
import { EntityManager } from 'typeorm';
import { OrderEntity } from '../entities/orders.entity';
import { OrderItemEntity } from '../entities/order-item.entity';
import { OrderInterface } from '../interfaces/order.interface';
import { ExpandedOrderItemInterface } from '../interfaces/expanded-order-item.interface';
import { ServiceExternalService } from '@modules/client/services/services/service-external.service';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { CustomerDecoratorDto } from '@src/utils/dtos/customer-decorator.dto';
import { OrderResponseDto } from '../dtos/order-response.dto';
import { AppointmentEntity } from '../entities/appointment.entity';
import { AppointmentService } from './appointment.service';
import { OrderItemService } from './order-item.service';
import { OrderSummaryDto } from '../dtos/order-summary.dto';
import { OutletExternalService } from '@modules/client/outlet/services/outlet-external.service';
import { OrderItemSummaryDto } from '../dtos/order-item-summary.dto';
import { OrderDetailsInterface } from '../interfaces/client-orders.interface';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { ClientOrderService } from './client-order.service';
import { ServiceSchema } from '@modules/client/services/schema/service.schema';
import { OutletEntity } from '@modules/client/outlet/entities/outlet.entity';
import { CustomerOrderResponseInterface } from '../interfaces/customer-order-response.interface';
import { throwIfNotFound } from '@src/utils/exceptions/common.exception';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly serviceExternalService: ServiceExternalService,
    private readonly orderItemService: OrderItemService,
    private readonly outletExternalService: OutletExternalService,
    @Inject(forwardRef(() => AppointmentService))
    private readonly appointmentService: AppointmentService,
    private readonly appointmentRepository: AppointmentRepository,
    private readonly clientOrderService: ClientOrderService,
  ) { }


  private async expandOrderItem(
    orderItems: OrderItemPayloadDto[],
  ): Promise<ExpandedOrderItemInterface[]> {
    const expandedOrderItems: ExpandedOrderItemInterface[] = [];

    for (const orderItem of orderItems) {
      const service =
        await this.serviceExternalService.getServiceByServiceAndOutletIdOrThrow(
          orderItem.serviceId,
          orderItem.outletId,
        );

      const expandedOrderItem: ExpandedOrderItemInterface = {
        quantity: orderItem.quantity,
        outletId: orderItem.outletId,
        notes: orderItem?.notes || '',
        service,
      };
      expandedOrderItems.push(expandedOrderItem);
    }

    return expandedOrderItems;
  }

  //This method calculates the total price for the order by iterating through the expanded order items, multiplying the price of each service by its quantity, and summing up the results to get the total amount to be paid for the order.
  private calculateTotalServicePrice(
    expandedOrderItems: ExpandedOrderItemInterface[],
  ): number {
    return expandedOrderItems.reduce(
      (acc, expandedOrderItem) =>
        acc + expandedOrderItem.service.price * expandedOrderItem.quantity,
      0,
    );
  }

  //This method prepares an order instance by calculating the total price of services and setting essential order details like payment ID, customer ID, outlet ID, and order status.
  private getOrderInstance(
    expandedOrderItems: ExpandedOrderItemInterface[],
    customerId: number,
  ): OrderInterface {
    const outletId = expandedOrderItems[0].outletId;
    const totalPrice = this.calculateTotalServicePrice(expandedOrderItems);

    const orderInstance: OrderInterface = {
      amountPaid: totalPrice,
      paymentId: 'dummyId',
      customerId: customerId,
      outletId: outletId,
      status: OrderStatusEnum.ORDER_PLACED,
    };
    return orderInstance;
  }

  //This method generates order item entities by mapping the expanded order item details into instances of OrderItemEntity with the associated order ID, ready to be saved in a transaction.
  private async createOrderItems(
    order: OrderEntity,
    expandedOrderItems: ExpandedOrderItemInterface[],
    transactionManager: EntityManager,
  ): Promise<OrderItemEntity[]> {
    const orderId = order.orderId;

    const orderItemInstances = expandedOrderItems.map((expandedOrderItem) => {
      // Use OrderItemEntity instead of the interface
      const orderItem = transactionManager.create(OrderItemEntity, {
        serviceId: expandedOrderItem.service._id.toString(),
        quantity: expandedOrderItem.quantity,
        notes: expandedOrderItem.notes,
        // outletId: expandedOrderItem.outletId,
        orderId,
      });
      return orderItem;
    });
    return orderItemInstances;
  }

  private formatOrderResponse(
    order: OrderEntity,
    orderItemsPayload: OrderItemPayloadDto[],
    appointment: AppointmentEntity,
  ): OrderResponseDto {
    return {
      orderId: order.orderId,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      orderItems: orderItemsPayload,
      outletId: order.outletId,
    } as OrderResponseDto;
  }

  // This method, called by the controller, manages the entire process of creating an order, including expanding the order item details, preparing the order instance, saving the order and its items in a transaction, and returning a structured response.
  async createOrder(
    createOrderDto: CreateOrderDto,
    customerDecoratorDto: CustomerDecoratorDto,
  ): Promise<OrderResponseDto> {
    const { customerId } = customerDecoratorDto;
    const { startTime } = createOrderDto;
    const currentTime = new Date();
    if (new Date(startTime) < currentTime) {
      throw new Error("start time shouldn't be in the past");
    }
    // Expand the orderItem payload to include service details
    const expandedOrderItems = await this.expandOrderItem(
      createOrderDto.orderItems,
    );

    // check the slot availability

    // Prepare the order instance
    const orderInstance = await this.getOrderInstance(
      expandedOrderItems,
      customerId,
    );

    // Use a query runner to manage the transaction
    const transactionManager = this.orderRepository
      .getRepository()
      .manager.connection.createQueryRunner();

    await transactionManager.startTransaction();
    try {
      // Save the order
      const order = await this.saveOrder(
        transactionManager.manager,
        orderInstance,
      );

      // Create the associated order items
      const orderItemInstances = await this.createOrderItems(
        order,
        expandedOrderItems,
        transactionManager.manager,
      );
      await this.saveOrderItems(transactionManager.manager, orderItemInstances); // Save the order items in the transaction

      // create appointment
      const appointment = await this.createAppointment(
        order,
        createOrderDto.orderItems,
        createOrderDto.startTime,
        createOrderDto.endTime,
      );

      // Commit the transaction
      await transactionManager.commitTransaction();

      // format order response
      const orderResponse = this.formatOrderResponse(
        order,
        createOrderDto.orderItems,
        appointment,
      );
      return orderResponse;
    } catch (error) {
      // Rollback the transaction if an error occurs
      await transactionManager.rollbackTransaction();
      throw error; // Re-throw the error for handling by the caller
    } finally {
      // Ensure the query runner is released
      await transactionManager.release();
    }
  }

  //This method creates and saves an order entity to the database within a transactional context.
  private async saveOrder(
    queryRunnerManager: EntityManager,
    orderData: OrderInterface,
  ): Promise<OrderEntity> {
    const order = this.orderRepository.getRepository().create(orderData); // Create the order entity
    return queryRunnerManager.save(OrderEntity, order); // Save the entity using the manager from queryRunner
  }

  private async createAppointment(
    order: OrderEntity,
    orderItemsPayload: OrderItemPayloadDto[],
    startTime: Date,
    providedEndTime: Date,
  ): Promise<AppointmentEntity> {
    //converting providedEndTime from string to Date type

    const providedTime = new Date(providedEndTime);
    const calculatedEndTime = await this.calculateEndTime(
      orderItemsPayload,
      startTime,
    );

    const createAppointmentDto = new CreateAppointmentDto();
    createAppointmentDto.customerId = order.customerId;
    createAppointmentDto.orderId = order.orderId;
    createAppointmentDto.outletId = order.outletId;
    createAppointmentDto.startTime = startTime;
    if (this.isEndTimeMatching(providedTime, calculatedEndTime)) {
      createAppointmentDto.endTime = calculatedEndTime;
    } else {
      createAppointmentDto.endTime = calculatedEndTime;
    }
    const appointment =
      await this.appointmentService.createAppointment(createAppointmentDto);
    return appointment;
  }

  private isEndTimeMatching(
    providedEndTime: Date,
    calculatedEndTime: Date,
  ): boolean {
    return providedEndTime.getTime() === calculatedEndTime.getTime();
  }

  //This method saves the order items to the database within a transactional context.
  private async saveOrderItems(
    transactionManager: EntityManager,
    orderItemInstances: OrderItemEntity[], // The order items to be saved
  ): Promise<OrderItemEntity[]> {
    return transactionManager.save(OrderItemEntity, orderItemInstances); // Save all order items in the transaction
  }

  private async calculateEndTime(
    orderItemsPayload: OrderItemPayloadDto[],
    startTime: Date,
  ): Promise<Date> {
    const startTimeAsDate =
      typeof startTime === 'string' ? new Date(startTime) : startTime;
    const totalDuration =
      await this.calculateOrderTotalDuration(orderItemsPayload);
    const endTime = new Date(startTimeAsDate.getTime() + totalDuration * 60000); // Convert minutes to milliseconds
    return endTime;
  }

  async calculateOrderTotalDuration(
    orderItemsPayload: OrderItemPayloadDto[],
  ): Promise<number> {
    // Step 1: Retrieve all expanded order items for the given order ID
    const expandedOrderItems = await this.expandOrderItem(orderItemsPayload); // Expand the order items to get service details, including duration
    if (!expandedOrderItems || expandedOrderItems.length === 0) {
      throw new NotFoundException('Order items not found.');
    }
    // Step 2: Calculate the total duration by summing up the service durations
    let totalDuration = 0;
    // Loop through each expanded order item
    for (const expandedOrderItem of expandedOrderItems) {
      // Fetch the service duration for each expanded order item
      const serviceDuration = expandedOrderItem.service.timeTaken; // Assuming 'duration' is a property of the service
      // Sum the service duration, considering the quantity for each order item
      totalDuration += serviceDuration * expandedOrderItem.quantity;
    }
    return totalDuration; // The total duration in minutes
  }

  async getEndTime(startTime: Date, orderId: number): Promise<Date> {
    // Step 1: Get the total duration using getOrderFulfillmentDuration
    const totalDuration = await this.getOrderFulfillmentDuration(orderId);
    const endTime = new Date(startTime.getTime() + totalDuration * 60000);
    // Step 2: Return the calculated end time
    return endTime;
  }

  async getOrderFulfillmentDuration(orderId: number): Promise<number> {
    // Step 1: Get all order items associated with the orderId
    const orderItems =
      await this.orderItemService.getAllOrderItemsByOrderId(orderId);

    // Step 2: Calculate the total duration by iterating over order items and fetching service details
    let totalDuration = 0;

    for (const item of orderItems) {
      try {
        // Step 3: Fetch the service details for the item using getServiceByServiceAndOutletIdOrThrow
        const service = await this.serviceExternalService.getServiceByIdOrThrow(
          item.serviceId,
        );
        totalDuration += service.timeTaken * item.quantity;
      } catch (error) {
        throw new Error(error);
      }
    }

    // Step 5: Return the total duration in minutes
    return totalDuration;
  }

  // summarizes the order details
  async getOrderSummaryByOrderIdOrThrow(
    orderId: number,
    customerId: number,
  ): Promise<OrderSummaryDto> {
    // Fetch core details: order and outlet
    const order = await this.getOrderByOrderAndCustomerIdOrThrow(
      orderId,
      customerId,
    );
    const outlet = await this.outletExternalService.getOutletByIdOrThrow(
      order.outletId,
    );

    // Fetch order items with necessary details (avoid circular reference by fetching services separately)
    const orderItems = await this.getOrderItemsWithRequiredDetails(orderId);

    // Calculate item total
    const itemTotal = this.calculateItemTotal(orderItems);

    // Return constructed response with necessary details
    return this.constructOrderSummaryResponse(
      order,
      outlet.name,
      orderItems,
      itemTotal,
    );
  }

  //fetches the order details by orderId
  async getOrderByOrderAndCustomerIdOrThrow(
    orderId: number,
    customerId,
  ): Promise<OrderEntity> {
    const order = await this.orderRepository.getRepository().findOne({
      where: { orderId: orderId, customerId: customerId },
    });
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found.`);
    }
    return order;
  }

  private async getOrderItemsWithRequiredDetails(
    orderId: number,
  ): Promise<OrderItemSummaryDto[]> {
    const orderItems =
      await this.orderItemService.getAllOrderItemsByOrderId(orderId);

    // Manually map orderItems to DTOs
    return Promise.all(
      orderItems.map(async (item) => {
        const service = await this.serviceExternalService.getServiceByIdOrThrow(
          item.serviceId,
        );
        return {
          name: service.serviceName,
          quantity: item.quantity,
          unitPrice: service.price,
          totalPrice: service.price * item.quantity,
        };
      }),
    );
  }

  private calculateItemTotal(items: { totalPrice: number }[]): number {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  private constructOrderSummaryResponse(
    order: OrderEntity,
    outletName: string,
    items: OrderItemSummaryDto[],
    itemTotal: number,
  ): OrderSummaryDto {
    return {
      orderId: order.orderId.toString(),
      outletName,
      orderDate: order.createdAt.toISOString().split('T')[0],
      items,
      itemTotal,
      grandTotal: itemTotal,
    };
  }

  async getOrderByIdOrThrow(orderId: number): Promise<OrderEntity> {
    const order = await this.orderRepository
      .getRepository()
      .findOne({ where: { orderId } });

    throwIfNotFound(order, `order with ${orderId} not found`);
    return order;
  }

  async getUpcomingOrdersForCustomer(
    customerId: number,
  ): Promise<CustomerOrderResponseInterface[]> {
    // Fetch upcoming orders based on the startTime from AppointmentEntity
    const upcomingOrders: OrderDetailsInterface[] =
      await this.appointmentRepository.getUpcomingOrdersForCustomer(customerId);
    // Extract unique serviceIds and outletIds
    const serviceIds = [
      ...new Set(upcomingOrders.map((order) => order.serviceId)),
    ];
    const outletIds = [
      ...new Set(upcomingOrders.map((order) => order.outletId)),
    ];
    // Use Promise.all to fetch services and outlet details in parallel
    const [services, outletDetails] = await Promise.all([
      this.serviceExternalService.getServicesByServiceIds(serviceIds),
      this.outletExternalService.getOutletDetailsByIds(outletIds),
    ]);
    // Format the results into the desired structure, including outlet details
    return this.formatCustomerOrderResponse(
      upcomingOrders,
      services,
      outletDetails,
    );
  }

  async getOrderHistoryForCustomer(
    customerId: number,
  ): Promise<CustomerOrderResponseInterface[]> {
    const pastOrders: OrderDetailsInterface[] =
      await this.appointmentRepository.getOrderHistoryForCustomer(customerId);
    // Extract unique serviceIds
    const serviceIds = [...new Set(pastOrders.map((order) => order.serviceId))];
    const outletIds = [...new Set(pastOrders.map((order) => order.outletId))];

    // Use Promise.all to fetch services and outlet details in parallel
    const [services, outletDetails] = await Promise.all([
      this.serviceExternalService.getServicesByServiceIds(serviceIds),
      this.outletExternalService.getOutletDetailsByIds(outletIds),
    ]);

    // Format the results into the desired structure
    return this.formatCustomerOrderResponse(
      pastOrders,
      services,
      outletDetails,
    );
  }

  formatCustomerOrderResponse(
    orders: OrderDetailsInterface[],
    services: ServiceSchema[],
    outletDetails: OutletEntity[],
  ): CustomerOrderResponseInterface[] {
    return orders.reduce((acc, row) => {
      // Find or create an order object
      let order = acc.find((item) => item.orderId === row.orderId);
      if (!order) {
        // Create a new order object if it doesn't exist in the accumulator
        order = {
          orderId: row.orderId,
          amountPaid: row.amountPaid,
          orderStatus: row.orderStatus,
          otp: row.otp,
          services: [],
          customer: {
            customerId: row.customerId,
            customerName: row.customerName,
            customerContact: row.customerContact,
            customerEmail: row.customerEmail,
            customerImage: '',
          },
          appointment: {
            appointmentId: row.appointmentId,
            startTime: row.startTime,
            endTime: row.endTime,
            AppointmentStatus: row.status,
          },
          outlet: {} as OutletEntity,
        };
        acc.push(order);
      }

      // Fetch outlet details for the current order
      const outlet = outletDetails.find((outlet) => outlet.id === row.outletId);

      if (outlet) {
        order.outlet = {
          outletId: outlet.id,
          outletName: outlet.name,
          outletDescription: outlet.description,
          outletLatitude: outlet.latitude,
          outletLongitude: outlet.longitude,
          outletPhoneNumber: outlet.phoneNumber,
          outletEmail: outlet.email,
          outletWebsite: outlet.website,
          address: outlet.address
            ? {
              addressId: outlet.address.addressId,
              country: outlet.address.country,
              state: outlet.address.state,
              district: outlet.address.district,
              city: outlet.address.city,
              pincode: outlet.address.pincode,
              street: outlet.address.street,
              landmark: outlet.address.landmark,
            }
            : null,
        };
      }

      // Format service details
      const formattedServiceDetails =
        this.clientOrderService.formatServiceDetails(row, services);

      // Add the formatted service details to the services array
      order.services.push(formattedServiceDetails);

      return acc;
    }, []);
  }

  async getCompletedOrdersForCustomer(
    customerId: number,
  ): Promise<CustomerOrderResponseInterface[]> {
    const completedOrders: OrderDetailsInterface[] =
      await this.appointmentRepository.getCompletedOrdersForCustomer(
        customerId,
      );
    // Extract unique serviceIds
    const serviceIds = [
      ...new Set(completedOrders.map((order) => order.serviceId)),
    ];
    const outletIds = [
      ...new Set(completedOrders.map((order) => order.outletId)),
    ];

    // Use Promise.all to fetch services and outlet details in parallel
    const [services, outletDetails] = await Promise.all([
      this.serviceExternalService.getServicesByServiceIds(serviceIds),
      this.outletExternalService.getOutletDetailsByIds(outletIds),
    ]);

    // Format the results into the desired structure
    return this.formatCustomerOrderResponse(
      completedOrders,
      services,
      outletDetails,
    );
  }


  async getOrderDetailsById(orderId: number): Promise<CustomerOrderResponseInterface> {
    const allOrders = await this.appointmentRepository.getOrderDetails(orderId);
    // Extract unique serviceIds and outletIds
    const serviceIds = [...new Set(allOrders.map((order) => order.serviceId))];
    const outletIds = [...new Set(allOrders.map((order) => order.outletId))];
  
    // Use Promise.all to fetch services and outlet details in parallel
    const [services, outletDetails] = await Promise.all([
      this.serviceExternalService.getServicesByServiceIds(serviceIds),
      this.outletExternalService.getOutletDetailsByIds(outletIds),
    ]);
  
    // Format the results and return
    return this.formatCustomerOrderDetailsResponse(allOrders, services, outletDetails);
  }
  

formatCustomerOrderDetailsResponse(orders, services, outletDetails): CustomerOrderResponseInterface {
  return orders.reduce((acc, row) => {
    if (!acc[row.orderId]) {
      acc[row.orderId] = {
        orderId: row.orderId,
        amountPaid: row.amountPaid,
        orderStatus: row.orderStatus,
        otp: row.otp,
        services: [],
        customer: {
          customerId: row.customerId,
          customerName: row.customerName,
          customerContact: row.customerContact,
          customerEmail: row.customerEmail,
          customerImage: '',
        },
        appointment: {
          appointmentId: row.appointmentId,
          startTime: row.startTime,
          endTime: row.endTime,
          AppointmentStatus: row.status,
        },
        outlet: {},
      };
    }

    const outlet = outletDetails.find((outlet) => outlet.id === row.outletId);
    if (outlet) {
      acc[row.orderId].outlet = {
        outletId: outlet.id,
        outletName: outlet.name,
        outletDescription: outlet.description,
        outletLatitude: outlet.latitude,
        outletLongitude: outlet.longitude,
        outletPhoneNumber: outlet.phoneNumber,
        outletEmail: outlet.email,
        outletWebsite: outlet.website,
        address: outlet.address
          ? {
              addressId: outlet.address.addressId,
              country: outlet.address.country,
              state: outlet.address.state,
              district: outlet.address.district,
              city: outlet.address.city,
              pincode: outlet.address.pincode,
              street: outlet.address.street,
              landmark: outlet.address.landmark,
            }
          : null,
      };
    }

    
    const formattedServiceDetails =
      this.clientOrderService.formatServiceDetails(row, services);

    
    acc[row.orderId].services.push(formattedServiceDetails);

    return acc;
  }, {})[orders[0]?.orderId];
}

  

}
