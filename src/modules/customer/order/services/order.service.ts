import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderRepositoy } from "../repositories/order.repository";
import { CreateOrderDto } from "../dtos/create-order.dto";
import { OrderItemRepository } from "../repositories/order-item.repository";
import { OutletExternalService } from "@modules/client/outlet/services/outlet-external.service";
import { CustomerDecoratorDto } from "@src/utils/dtos/customer-decorator.dto";
import { OrderedServicesDetailsDto } from "../dtos/ordered-services-details.dto";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepositoy,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly outletExternalService: OutletExternalService
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, customer: CustomerDecoratorDto): Promise<CreateOrderDto> {
    const { services, customerId, outletId, paymentId } = createOrderDto;

    // Process services to validate, calculate, and prepare data
    const { amountPaid, orderItems, orderedServices } = await this.prepareOrderData(services, customer);

    // Create and save the order
    const savedOrder = await this.saveOrder({ customerId, paymentId, amountPaid });

    // Save order items associated with the order
    await this.saveOrderItems(orderItems, savedOrder);

    // Return a structured response payload
    return this.createResponsePayload(orderedServices, customerId, outletId, paymentId);
  }

  private async prepareOrderData(services: any[], customer: CustomerDecoratorDto) {
    const orderItems = [];
    const orderedServices: OrderedServicesDetailsDto[] = [];
    let amountPaid = 0;

    for (const service of services) {
      const { serviceTotal, orderItem, orderedService } = await this.processService(service, customer);

      amountPaid += serviceTotal; // Replacing totalPrice with amountPaid
      orderItems.push(orderItem);
      orderedServices.push(orderedService);
    }

    return { amountPaid, orderItems, orderedServices };
  }

  private async processService(service: any, customer: CustomerDecoratorDto) {
    const { serviceId, quantity, outletId, startTime, notes } = service;

    const serviceData = await this.validateServiceAndOutlet(outletId, serviceId, customer);
    if (!serviceData) {
      throw new BadRequestException(`Invalid serviceId: ${serviceId} or outletId: ${outletId}`);
    }

    const { price, duration, discount } = serviceData;
    const { serviceTotal, endTime } = this.calculateServiceDetails(price, discount, duration, quantity, startTime);

    // Prepare order item and service details
    const orderItem = this.createOrderItem(serviceId, quantity, discount, notes);
    const orderedService: OrderedServicesDetailsDto = { serviceId, startTime, endTime, quantity, outletId, notes };

    return { serviceTotal, orderItem, orderedService };
  }

  private calculateServiceDetails(price: number, discount: number, duration: number, quantity: number, startTime: Date) {
    const discountedPrice = price - price * (discount / 100);
    const serviceTotal = discountedPrice * quantity;
    const totalDuration = duration * quantity; // Duration in minutes
    const endTime = new Date(new Date(startTime).getTime() + totalDuration * 60000);

    return { serviceTotal, endTime };
  }

  private createOrderItem(serviceId: string, quantity: number, discount: number, notes: string) {
    return this.orderItemRepository.getRepository().create({
      serviceId,
      quantity,
      discount,
      notes,
    });
  }

  private async saveOrder(orderData: { customerId: number; paymentId: string; amountPaid: number }) {
    const order = this.orderRepository.getRepository().create(orderData);
    return this.orderRepository.getRepository().save(order);
  }

  private async saveOrderItems(orderItems: any[], savedOrder: any) {
    const itemsToSave = orderItems.map((item) => ({
      ...item,
      order: savedOrder,
    }));
    await this.orderItemRepository.getRepository().save(itemsToSave);
  }

  private async validateServiceAndOutlet(outletId: number, serviceId: string, customer: CustomerDecoratorDto) {
    const service = await this.outletExternalService.getServiceByServiceAndOutletIdOrThrow(outletId, serviceId, customer);
    return { price: service.price, duration: service.timeTaken, discount: service.discount };
  }

  private createResponsePayload(
    orderedServices: OrderedServicesDetailsDto[],
    customerId: number,
    outletId: number,
    paymentId: string
  ): CreateOrderDto {
    return { services: orderedServices, customerId, outletId, paymentId };
  }
}
