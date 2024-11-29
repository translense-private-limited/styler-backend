import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders') // Table name
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  orderId: string; // Primary key for the order

  @Column('decimal', { precision: 10, scale: 2 })
  price: number; // Total price of the order

  @Column('uuid')
  paymentId: string; // ID of the payment transaction

  @Column()
  customerId: number; // ID of the customer placing the order

  @CreateDateColumn()
  createdAt: Date; // Timestamp of order creation

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp of order update
}
