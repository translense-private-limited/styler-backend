import { OutletEntity } from '@modules/client/outlet/entities/outlet.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('address')
export class AddressEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  addressId: number;

  @Column({nullable:false,type:'varchar'})
  propertyNumber:string;

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
  landmark?: string;

  @OneToOne(() => OutletEntity, (outlet) => outlet.address)
  @JoinColumn({ name: 'outletId' }) // Defines the foreign key column in the addresses table
  outlet: OutletEntity;

  @Column({type:'int',nullable:true})
  outletId:number
}
