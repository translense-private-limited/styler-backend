import { Injectable } from '@nestjs/common';
import { OrderItemPayloadDto } from '../dtos/order-item.dto';
import { OrderItemRepository } from '../repositories/order-item.repository';
import { OrderItemEntity } from '../entities/order-item.entity';

@Injectable()
export class OrderItemService {
  constructor(private readonly orderItemRepository: OrderItemRepository) {}

  // Method to calculate the total for a service (with discount)
  calculateDiscountedPrice(
    price: number,
    discount: number,
    quantity: number,
  ): number {
    const discountedPrice = price - price * (discount / 100);
    return discountedPrice * quantity;
  }

  // Method to calculate the end time of a service
  calculateEndTime(duration: number, quantity: number, startTime: Date): Date {
    const totalDuration = duration * quantity; // Duration in minutes
    return new Date(new Date(startTime).getTime() + totalDuration * 60000);
  }

  // Method to create a new order item in the database
  createOrderItem(
    serviceId: string,
    quantity: number,
    discount: number,
    notes: string,
  ): OrderItemEntity {
    return this.orderItemRepository
      .getRepository()
      .create({ serviceId, quantity, discount, notes });
  }

  // Method to create ordered service data to return as a DTO
  createOrderedService(
    orderedServices: OrderItemPayloadDto,
  ): OrderItemPayloadDto {
    // return { serviceId, startTime, endTime, quantity, outletId, notes };
    return orderedServices;
  }
}
