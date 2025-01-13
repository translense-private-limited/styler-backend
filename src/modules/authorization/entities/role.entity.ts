import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { UserTypeEnum } from '../../../utils/enums/user-type.enum';

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

  @Column({nullable:true})
  outletId: number|null;
}
