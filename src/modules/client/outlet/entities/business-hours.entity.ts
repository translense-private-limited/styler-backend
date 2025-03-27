import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { OutletEntity } from './outlet.entity';
import { BaseEntity } from '@src/utils/entities/base.entity';
import { DayOfWeekEnum } from '@src/utils/enums/day-of-week.enum';

@Entity('business_hour')
export class BusinessHourEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OutletEntity, { onDelete: 'CASCADE' })
  @Index()
  outlet: OutletEntity;

  @Column('json')
  weeklySchedule: Record<
    DayOfWeekEnum,
    { openingTime: string; closingTime: string; isClosed: boolean }
  >;
}
