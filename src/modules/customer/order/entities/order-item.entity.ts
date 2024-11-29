import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OrderEntity } from './orders.entity';
import { IsOptional } from 'class-validator';
@Entity('order_items')
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  orderItemId: string; // Primary key for the order item

  @Column('uuid')
  serviceId: string; // ID of the service associated with this order item

  @Column('int')
  quantity: number; // Quantity of the service ordered

  @Column('decimal', { precision: 10, scale: 2 })
  discount: number; // Discount applied to this order item

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  notes?: string; // Optional notes for the order item

  @CreateDateColumn()
  createdAt: Date; // Timestamp of order item creation

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp of order item update

  // Establishes the relationship between order items and orders
  @ManyToOne(() => OrderEntity, (order) => order.orderId, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'orderId' })  // Specifies the foreign key column name
  order: OrderEntity;  // Foreign key to the OrderEntity
}
