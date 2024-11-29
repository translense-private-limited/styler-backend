import { BaseEntity } from '@src/utils/entities/base.entity';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { CustomerInterface } from '../interfaces/customer.interface';

@Entity('customers')
export class CustomerEntity extends BaseEntity implements CustomerInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Index('IX_customers_contactNumber')
  // Individual index for faster lookups
  @Column({ type: 'varchar', length: 15, unique: true })
  contactNumber: number;

  @Index('IX_customers_email') // Individual index for faster lookups
  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  @Column({default:1})
  whitelabelId:number;
}
