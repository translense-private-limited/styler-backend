import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, BaseEntity } from 'typeorm';

@Entity('roles')
export class RoleEntity extends BaseEntity  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column() 
  isSystemDefined: boolean;

  @Column() 
  outletId: number;
}