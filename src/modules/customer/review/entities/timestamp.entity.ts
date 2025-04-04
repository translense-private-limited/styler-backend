import { BaseEntity } from '@src/utils/entities/base.entity';
import { JobEnum } from '@src/utils/enums/job.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reviews')
export class TimestampEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: JobEnum }) // Corrected enum syntax
  jobName: JobEnum;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Fixed type and added default
  lastSyncTime: Date;
}
