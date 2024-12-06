import { BaseEntity } from "@src/utils/entities/base.entity";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { AdminInterface } from "../interfaces/admin.interface";

@Entity('admin')
export class AdminEntity extends BaseEntity implements AdminInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 }) 
  name: string;

  @Index('IX_admins_contactNumber', ['contactNumber']) // Index for contact number
  @Column({ type: 'varchar',unique: true })
  contactNumber: number;
  
  @Column()
  roleId: number;
  
  @Index('IX_admins_email', ['email']) // Index for faster lookups on email
  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;
}
