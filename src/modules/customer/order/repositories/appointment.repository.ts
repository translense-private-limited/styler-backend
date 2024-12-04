import { InjectRepository } from '@nestjs/typeorm';
import { getMysqlDataSource } from '@modules/database/data-source';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/utils/repositories/base-repository';
import { AppointmentEntity } from '../entities/appointment.entity';

export class AppointmentRepository extends BaseRepository<AppointmentEntity> {
  constructor(
    @InjectRepository(AppointmentEntity, getMysqlDataSource())
    protected repository: Repository<AppointmentEntity>,
  ) {
    super(repository);
  }
}
