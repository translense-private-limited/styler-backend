import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { UserTypeEnum } from '../enums/usertype.enum';

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
    enum: UserTypeEnum,
  })
  scope: UserTypeEnum;

  @Column()
  outletId: number;
}
