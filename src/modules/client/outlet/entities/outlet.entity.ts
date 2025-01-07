import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { OutletStatusEnum } from '../enums/outlet-status.enum';
import { BaseEntity } from '@src/utils/entities/base.entity';
import { AddressEntity } from '@src/utils/entities/address.entity';
@Entity('outlets')
export class OutletEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: OutletStatusEnum,
    default: OutletStatusEnum.UNDER_CONSTRUCTION,
  })
  status: OutletStatusEnum;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  longitude: number;

  @Column({ length: 15, nullable: true })
  phoneNumber: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true })
  website: string;

  @Column({ type: 'int',nullable:true })
  clientId: number;

  @OneToOne(() => AddressEntity, (address) => address.outlet)
  address: AddressEntity; // One-to-one relation with Address

  @Column({nullable:true})
  addressId:number

  @Column('simple-array',{nullable:true})
  outletBannerImages:string[];

  @Column('simple-array',{nullable:true})
  outletVideos: string[];
}
