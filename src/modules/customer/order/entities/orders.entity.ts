import { BaseEntity } from '@src/utils/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OrderInterface } from '../interfaces/order.interface';
import { OrderStatusEnum } from '../enums/order-status.enum';

@Entity('orders') // Table name
export class OrderEntity extends BaseEntity implements OrderInterface {
  @PrimaryGeneratedColumn()
  orderId: number; // Primary key for the order

  @Column('decimal', { precision: 10, scale: 2 })
  amountPaid: number; // Total price of the order

  @Column('uuid', { nullable: true })
  paymentId?: string; // ID of the payment transaction

  @Column()
  customerId: number; // ID of the customer placing the order

  @Column()
  outletId: number;

  @Column({default:OrderStatusEnum.ORDER_PLACED})
  status?: OrderStatusEnum;

  @Column({nullable:true})
  reasonForRejection:string;
}
