import { BaseRepository } from '@src/utils/repositories/base-repository';
import { getMysqlDataSource } from '@modules/database/data-source';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpEntity } from '../entities/otp.entity';

export class OtpRepository extends BaseRepository<OtpEntity> {
  constructor(
    @InjectRepository(OtpEntity, getMysqlDataSource())
    protected repository: Repository<OtpEntity>,
  ) {
    super(repository);
  }
}
