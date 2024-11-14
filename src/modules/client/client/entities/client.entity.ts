import { BaseEntity } from '@src/utils/entities/base.entity';
import { Gender } from '@src/utils/enums/gender.enums';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('client')
export class ClientEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ nullable:true })
  password: string;

  @Column()
  contactNumber:string;

  @Column()
  roleId:number;

  @Column()
  gender:Gender;

  @Column()
  pastExperience:number;

  @Column()
  about:string;
  
  @Column()
  outletId:number;

}
