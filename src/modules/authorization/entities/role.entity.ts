import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { roles } from '../enums/roles.enum';

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
    enum: roles,
  })
  keyScope: roles;  

  @Column()
  outletId: number;
}
