import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'client_outlet_mapping' }) // This will create a table named 'client_outlet'
export class ClientOutletMappingEntity {
  @PrimaryGeneratedColumn()
  clientOutletMappingId: number;

  @Column()
  clientId: number;

  @Column()
  outletId: number;
}
