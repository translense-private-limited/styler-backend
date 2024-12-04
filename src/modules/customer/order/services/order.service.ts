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

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly serviceExternalService: ServiceExternalService,
    @Inject(forwardRef(() => AppointmentService))
    private readonly appointmentService: AppointmentService,
  ) {}

  /*This method processes each orderItem from the provided list, retrieves the corresponding service details using serviceExternalService, and constructs an expanded order item with the service details, quantity, outlet ID, and notes.
  It returns an array of expanded order items with all necessary data for further processing.*/
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
      const appointment = new AppointmentEntity();

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
  ): Promise<AppointmentEntity> {
    const endTime = await this.calculateEndTime(orderItemsPayload, startTime);

    const createAppointmentDto = new CreateAppointmentDto();
    createAppointmentDto.customerId = order.customerId;
    createAppointmentDto.orderId = order.orderId;
    createAppointmentDto.outletId = order.outletId;
    createAppointmentDto.startTime = startTime;
    createAppointmentDto.endTime = endTime;

    const appointment =
      await this.appointmentService.createAppointment(createAppointmentDto);
    return appointment;
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
    // utilise the getOrderFullmentDuration
    // return the end time
  }

  // returns in minutes
  async getOrderFullmentDuration(orderId: number): promise<number> {
    // get all order items aassosiated wtih it
    // create method in order iems service to return order item based on order id.
    // form order items recieved get all the service id and corresponding quantity
    // pull the service details using service SErvice
    // use quantity adn duration to figure otu real time .
    // return time in min
  }
}
