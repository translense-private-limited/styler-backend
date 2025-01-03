import { BaseEntity } from '@src/utils/entities/base.entity';
import { GenderEnum } from '@src/utils/enums/gender.enums';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('client')
export class ClientEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ nullable: true, default: null })
  password: string;

  @Column()
  contactNumber: string;

  @Column()
  roleId: number;

  @Column()
  gender: GenderEnum;

  @Column()
  pastExperience: number;

  @Column()
  about?: string;

  @Column({ default: null })
  outletId: number;

  @Column('text', { nullable: true })
  profilePhoto: string[]; 
}