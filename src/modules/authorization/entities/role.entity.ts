import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import {  UserType } from '../enums/usertype.enum';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column()
  isSystemDefined: boolean;

  @Column({
    type: 'enum',
    enum: UserType,
  })
  scope: UserType;  

  @Column({nullable:true})
  outletId: number|null;
}
