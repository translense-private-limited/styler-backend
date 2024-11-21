import { BaseEntity } from '@src/utils/entities/base.entity';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { CustomerInterface } from '../interfaces/customer.interface';

@Entity('customers')
@Index(['email', 'contactNumber'], { unique: true }) // Compound index for uniqueness
export class CustomerEntity extends BaseEntity implements CustomerInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Index() // Individual index for faster lookups
  @Column({ type: 'varchar', length: 15, unique: true })
  contactNumber: number;

  @Index() // Individual index for faster lookups
  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;
}
