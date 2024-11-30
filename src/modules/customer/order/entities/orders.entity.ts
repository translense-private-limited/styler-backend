import { BaseEntity } from '@src/utils/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orders') // Table name
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  orderId: number; // Primary key for the order

  @Column('decimal', { precision: 10, scale: 2 })
  amountPaid: number; // Total price of the order

  @Column('uuid',{default:null})
  paymentId: string; // ID of the payment transaction

  @Column()
  customerId: number; // ID of the customer placing the order

}
