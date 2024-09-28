import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('address')
export class AddressEntity {
  @PrimaryGeneratedColumn()
  addressId: number;

  @Column({ type: 'int' })
  entityId: number;

  @Column({ default: 'india', type: 'varchar', length: 56 })
  country: string;

  @Column({ type: 'varchar' })
  state: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  district: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  city: string;

  @Column({ type: 'int' })
  pincode: number;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  street: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  landmark: string;
}
