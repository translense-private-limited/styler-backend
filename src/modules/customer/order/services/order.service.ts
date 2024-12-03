import { Injectable } from '@nestjs/common';
import { OrderRepositoy } from '../repositories/order.repository';
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

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepositoy,
    private readonly serviceExternalService: ServiceExternalService,
  ) {}

  private async expandOrderItem(
    orderItems: OrderItemPayloadDto[],
  ): Promise<ExpandedOrderItemInterface[]> {
    const expandedOrderItems: ExpandedOrderItemInterface[] = [];
  
    for (const orderItem of orderItems) {
      const service = await this.serviceExternalService.getServiceByServiceAndOutletIdOrThrow(
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
  

  private calculateTotalServicePrice(expandedOrderItems: ExpandedOrderItemInterface[]): number {
    // Calculate the total price considering quantity and price
    return expandedOrderItems.reduce((acc, expandedOrderItem) => acc + (expandedOrderItem.service.price * expandedOrderItem.quantity), 0);
  }  

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
      const orderItemInstances = await this.createOrderItems(
        order,
        expandedOrderItems,
        transactionManager.manager,
      );
      await this.saveOrderItems(
        transactionManager.manager, 
        orderItemInstances); // Save the order items in the transaction

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
  ):Promise<OrderEntity> {
    const order = this.orderRepository.getRepository().create(orderData); // Create the order entity
    return queryRunnerManager.save(OrderEntity, order); // Save the entity using the manager from queryRunner
  }

  private async saveOrderItems(
    transactionManager: EntityManager,
    orderItemInstances: OrderItemEntity[], // The order items to be saved
  ): Promise<OrderItemEntity[]> {
    return transactionManager.save(OrderItemEntity, orderItemInstances); // Save all order items in the transaction
  }
  
}
