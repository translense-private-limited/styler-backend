import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { OrderEntity } from './orders.entity';
import { IsOptional } from 'class-validator';
import { BaseEntity } from '@src/utils/entities/base.entity';
import { OrderItemStatusEnum } from '../enums/order-item-status.enum';
@Entity('order_items')
export class OrderItemEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  orderItemId: number; // Primary key for the order item

  @Column('uuid')
  serviceId: string; // ID of the service associated with this order item

  @Column('int')
  quantity: number; // Quantity of the service ordered

  @Column('decimal', { precision: 10, scale: 2,default:0 })
  @IsOptional()
  discount?: number; // Discount applied to this order item

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  notes?: string; // Optional notes for the order item

  @Column({default:OrderItemStatusEnum.ACCEPTED})
  status:OrderItemStatusEnum

  @ManyToOne(() => OrderEntity, (order) => order.orderId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  orderId: number;
}
