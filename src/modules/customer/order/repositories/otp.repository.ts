import { BaseRepository } from '@src/utils/repositories/base-repository';
import { getMysqlDataSource } from '@modules/database/data-source';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpVerificationEntity } from '../entities/otp.entity';

export class OtpVerificationRepository extends BaseRepository<OtpVerificationEntity> {
  constructor(
    @InjectRepository(OtpVerificationEntity, getMysqlDataSource())
    protected repository: Repository<OtpVerificationEntity>,
  ) {
    super(repository);
  }
}
