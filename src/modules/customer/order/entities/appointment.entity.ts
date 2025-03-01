import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from '@src/utils/entities/base.entity';
import { BookingStatusEnum } from '../enums/booking-status.enum';
import { AppointmentSourceEnum } from '../enums/booking-source.enum';

@Entity('appointments')
export class AppointmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  appointmentId: number; // Primary key for the appointment

  @Column({ type: 'int' })
  orderId: number; // ID of the order associated with this appointment

  @Column({ type: 'datetime' })
  startTime: Date; // The scheduled start time of the appointment

  @Column({ type: 'datetime' })
  endTime: Date; // The scheduled end time of the appointment

  @Column({ type: 'int' })
  outletId: number; // ID of the outlet where the service is scheduled

  @Column({ type: 'int' })
  customerId: number; // ID of the customer who booked the appointment

  @Column({
    type: 'enum',
    enum: BookingStatusEnum,
    default: BookingStatusEnum.PENDING,
  })
  status: BookingStatusEnum; // Status of the appointment

  @Column({ type: 'datetime', nullable: true })
  actualStartTime?: Date; // The actual start time of the appointment, if it occurred

  @Column({ type: 'datetime', nullable: true })
  actualEndTime?: Date; // The actual end time of the appointment, if it occurred

  @Column({
    type: 'enum',
    enum: AppointmentSourceEnum,
    default: AppointmentSourceEnum.CUSTOMER,
  })
  appointmentSource: AppointmentSourceEnum; // Status of the appointment
}
