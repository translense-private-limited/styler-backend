import { Injectable } from "@nestjs/common";
import { OrderRepositoy } from "../repositories/order.repository";
import { CreateOrderDto } from "../dtos/create-order.dto";
import { OrderItemRepository } from "../repositories/order-item.repository";
import { OutletExternalService } from "@modules/client/outlet/services/outlet-external.service";
import { CustomerDecoratorDto } from "@src/utils/dtos/customer-decorator.dto";
import { OrderItemPayloadDto } from "../dtos/order-item.dto";
import { OrderDto } from "../dtos/order.dto";
import { OrderItemService } from "./order-item.service"; // Import the OrderItemService
import { EntityManager, } from "typeorm";
import { OrderEntity } from "../entities/orders.entity";
import { OrderItemEntity } from "../entities/order-item.entity";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepositoy,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly outletExternalService: OutletExternalService,
    private readonly orderItemService: OrderItemService // Inject the OrderItemService
) {}

async createOrder(createOrderDto: CreateOrderDto, customer: CustomerDecoratorDto): Promise<CreateOrderDto> {
  const { orderItems, customerId, outletId, paymentId } = createOrderDto;

  // Prepare data for order creation
  const { amountPaid, orderInstance, orderedServicesPayloadData } = await this.prepareOrderData(orderItems, customer);

  // Use transaction to ensure atomicity
  const queryRunner = this.orderRepository.getRepository().manager.connection.createQueryRunner();

  await queryRunner.startTransaction();
  try {
// When passing to saveOrder and saveOrderItems, use queryRunner.manager
    const savedOrder = await this.saveOrder(queryRunner.manager, { customerId, paymentId, amountPaid, outletId });
    await this.saveOrderItems(queryRunner.manager, orderInstance, savedOrder);

    // Commit the transaction
    await queryRunner.commitTransaction();

    // Return structured response
    return this.createResponsePayload(orderedServicesPayloadData, customerId, outletId, paymentId);
  } catch (error) {
    // If any error occurs, rollback the transaction
    await queryRunner.rollbackTransaction();
    throw error; // Re-throw the error to handle it outside
  } finally {
    // Release the query runner regardless of success or failure
    await queryRunner.release();
  }
}

private async prepareOrderData(services: OrderItemPayloadDto[], customer: CustomerDecoratorDto) {
  let amountPaid = 0;
  const orderInstance = [];
  const orderedServicesPayloadData: OrderItemPayloadDto[] = [];

  for (const service of services) {
    const { serviceTotal, orderItem, orderedService } = await this.prepareOrderInstanceData(service, customer);
    amountPaid += serviceTotal;
    orderInstance.push(orderItem);
    orderedServicesPayloadData.push(orderedService);
  }

  return { amountPaid, orderInstance, orderedServicesPayloadData };
}

private async prepareOrderInstanceData(service: OrderItemPayloadDto, customer: CustomerDecoratorDto) {
  const { serviceId, quantity, outletId, startTime, notes } = service;

  // Validate service and outlet
  const serviceData = await this.validateServiceAndOutlet(outletId, serviceId, customer);

  // Use OrderItemService to calculate service total and end time
  const serviceTotal = this.orderItemService.calculateDiscountedPrice(serviceData.price, serviceData.discount,quantity);
  const endTime = this.orderItemService.calculateEndTime(serviceData.duration, quantity, startTime);

  // Prepare order item and service details
  const orderItem = this.orderItemService.createOrderItem(serviceId, quantity, serviceData.discount, notes);
  const orderedService: OrderItemPayloadDto = this.orderItemService.createOrderedService({serviceId, startTime, endTime, quantity, outletId, notes});

  return { serviceTotal, orderItem, orderedService };
}

private async validateServiceAndOutlet(outletId: number, serviceId: string, customer: CustomerDecoratorDto) {
  const service = await this.outletExternalService.getServiceByServiceAndOutletIdOrThrow(outletId, serviceId, customer);
  return { price: service.price, duration: service.timeTaken, discount: service.discount };
}

private async saveOrder(queryRunnerManager: EntityManager, orderData: { customerId: number; paymentId: string; amountPaid: number; outletId: number }) {
    const order = this.orderRepository.getRepository().create(orderData); // Create the order entity
    return queryRunnerManager.save(OrderEntity, order); // Save the entity using the manager from queryRunner
}

private async saveOrderItems(queryRunner: EntityManager, orderItems: Partial<OrderItemPayloadDto[]>, savedOrder: OrderDto) {
  const itemsToSave = orderItems.map((item) => ({
    ...item,
    order: savedOrder,
  }));
  await queryRunner.save(OrderItemEntity, itemsToSave); // Directly call save() on queryRunner
}

private createResponsePayload(
  orderedServicesPayloadData: OrderItemPayloadDto[],
  customerId: number,
  outletId: number,
  paymentId: string
): CreateOrderDto {
  return { orderItems: orderedServicesPayloadData, customerId, outletId, paymentId };
}
}
