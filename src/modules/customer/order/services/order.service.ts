import { Injectable } from '@nestjs/common';
import { OrderRepositoy } from '../repositories/order.repository';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderItemPayloadDto } from '../dtos/order-item.dto';
import { EntityManager } from 'typeorm';
import { OrderEntity } from '../entities/orders.entity';
import { OrderItemEntity } from '../entities/order-item.entity';
import { ServiceSchema } from '@modules/client/services/schema/service.schema';
import { OrderInterface } from '../interfaces/order.interface';
import { ExpandedOrderItemInterface } from '../interfaces/expanded-order-item.interface';
import { ServiceExternalService } from '@modules/client/services/services/service-external.service';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { CustomerDecoratorDto } from '@src/utils/dtos/customer-decorator.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepositoy,
    private serviceExternalService: ServiceExternalService,
  ) {}

  private async expandOrderItem(
    orderItems: OrderItemPayloadDto[],
  ): Promise<ExpandedOrderItemInterface[]> {
    const expandedOrderItems: ExpandedOrderItemInterface[] = [];
    orderItems.forEach(async (orderItem) => {
      const expandedOrderItem: ExpandedOrderItemInterface = {
        quantity: orderItem.quantity,
        outletId: orderItem.outletId,
        notes: orderItem?.notes || '',
        service:
          await this.serviceExternalService.getServiceByServiceAndOutletIdOrThrow(
            orderItem.serviceId,
            orderItem.outletId,
          ),
      };
      expandedOrderItems.push(expandedOrderItem);
    });
    return expandedOrderItems;
  }

  private calculateTotalServicePrice(services: ServiceSchema[]): number {
    // need changes when we think of discount
    return services.reduce((acc, service) => acc + service.price, 0);
  }

  private getOrderInstance(
    expandedOrderItems: ExpandedOrderItemInterface[],
    customerId: number,
  ): OrderInterface {
    // calculate the order order total
    const services = expandedOrderItems.map(
      (expandedOrderItem) => expandedOrderItem.service,
    );

    const outletId = expandedOrderItems[0].outletId;
    const totalPrice = this.calculateTotalServicePrice(services);

    const orderInstance: OrderInterface = {
      amountPaid: totalPrice,
      paymentId: 'dummyId',
      customerId: customerId,
      outletId: outletId,
      status: OrderStatusEnum.ORDER_PLACED,
    };
    return orderInstance;
  }

  private async createOrderItems(
    order: OrderEntity,
    expandedOrderItems: ExpandedOrderItemInterface[],
    transactionManager: EntityManager,
  ): Promise<OrderItemEntity[]> {
    const orderId = order.orderId;

    const orderItemInstances = expandedOrderItems.map((expandedOrderItem) => {
      // Use OrderItemEntity instead of the interface
      const orderItem = transactionManager.create(OrderItemEntity, {
        serviceId: expandedOrderItem.service._id as string,
        quantity: expandedOrderItem.quantity,
        notes: expandedOrderItem.notes,
        outletId: expandedOrderItem.outletId,
        orderId,
      });
      return orderItem;
    });

    return orderItemInstances;
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    customerDecoratorDto: CustomerDecoratorDto,
  ): Promise<string> {
    const { customerId } = customerDecoratorDto;

    // Expand the orderItem payload to include service details
    const expandedOrderItems = await this.expandOrderItem(
      createOrderDto.orderItems,
    );

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
      await this.createOrderItems(
        order,
        expandedOrderItems,
        transactionManager.manager,
      );

      // Commit the transaction
      await transactionManager.commitTransaction();

      // Return structured response
      return 'Order created successfully';
    } catch (error) {
      // Rollback the transaction if an error occurs
      await transactionManager.rollbackTransaction();
      throw error; // Re-throw the error for handling by the caller
    } finally {
      // Ensure the query runner is released
      await transactionManager.release();
    }
  }

  private async saveOrder(
    queryRunnerManager: EntityManager,
    orderData: OrderInterface,
  ) {
    const order = this.orderRepository.getRepository().create(orderData); // Create the order entity
    return queryRunnerManager.save(OrderEntity, order); // Save the entity using the manager from queryRunner
  }
}
