import { ClientEntity } from '@modules/client/client/entities/client.entity';
import { OutletEntity } from '@modules/client/outlet/entities/outlet.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';


@Entity({ name: 'client_outlet_mapping' }) // This will create a table named 'client_outlet'
export class ClientOutletMappingEntity {
  @PrimaryGeneratedColumn()
  clientOutletMappingId: number;

 
  @Column()
  clientId: number;


  @Column()
 outletId: number
}
